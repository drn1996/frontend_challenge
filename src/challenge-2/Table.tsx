import { Order, SortDirection, SortField } from "./types"

export type TableProps = {
    handleSort:  (field: SortField) => void,
    sortField: SortField,
    sortDirection: SortDirection,
    paginatedOrders: Order[]
}

export const Table = (props: TableProps) => {
    const {handleSort, sortField, sortDirection, paginatedOrders} = props;

    return (

      <table>
        <thead>
          <tr>
            <th
              className="sortable"
              onClick={() => handleSort('customerName')}
              style={{ cursor: 'pointer' }}
            >
              Customer {sortField === 'customerName' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Order ID</th>
            <th
              className="sortable"
              onClick={() => handleSort('status')}
              style={{ cursor: 'pointer' }}
            >
              Status {sortField === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th
              className="sortable"
              onClick={() => handleSort('total')}
              style={{ cursor: 'pointer' }}
            >
              Total {sortField === 'total' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th
              className="sortable"
              onClick={() => handleSort('createdAt')}
              style={{ cursor: 'pointer' }}
            >
              Date {sortField === 'createdAt' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.customerName}</td>
              <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{order.id}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td>
                {'$' + order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))}
          {paginatedOrders.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                No orders match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
}