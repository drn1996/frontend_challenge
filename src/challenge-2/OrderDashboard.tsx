import { useState, useEffect, useMemo } from 'react'
import { fetchOrders } from '../api/mockApi'
import type { Order, SortField, SortDirection } from './types'
import { Table } from './Table'

const PAGE_SIZE = 10

const getSortingHandlers = () => ({
  customerName: (direction: any, a: any, b: any) => direction * a.customerName.localeCompare(b.customerName),
  total: (direction: any, a: any, b: any) => direction * (a.total - b.total),
  createdAt: (direction: any, a: any, b: any) => direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  status: (direction: any, a: any, b: any) => direction * a.status.localeCompare(b.status),
})

export const useGetOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true);
    fetchOrders().then(order => setOrders(order)).catch(e => setError(e)).finally(() => setLoading(false))
  }, [])

  return {
    orders, loading, error
  }
}

export function OrderDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const { orders, error, loading } = useGetOrders();

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(lower) ||
          order.id.toLowerCase().includes(lower),
      )
    }
    return result;
  }, [orders, status, searchQuery, statusFilter])

  const direction = useMemo(() => sortDirection === 'asc' ? 1 : -1, [sortDirection]);



  const sortedOrders = useMemo(() => [...filteredOrders].sort((a, b) =>  getSortingHandlers()[sortField](direction, a, b)), [filteredOrders, sortField, direction]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE)), [sortedOrders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedOrders.slice(start, start + PAGE_SIZE)
  }, [sortedOrders])


  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  if (loading) {
    return <p>Loading orders...</p>
  }

  return (
    <div>
      <h2>Order Dashboard</h2>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => {
            setCurrentPage(1)
            setSearchQuery(e.target.value)
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1)
            setStatusFilter(e.target.value)
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#888' }}>
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
        </span>
      </div>
      
      <Table sortDirection={sortDirection} sortField={sortField} handleSort={handleSort} paginatedOrders={paginatedOrders} />

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
          Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of{' '}
          {'$' + filteredOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total
        </span>
      </div>
    </div>
  )
}
