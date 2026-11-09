import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '@services/order.service';
import type { OrderEntity } from '@services/order.service';

interface OrderListProps {
  onError: (message: string) => void;
}

export function OrderList({ onError }: OrderListProps) {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const orderService = new OrderService();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      onError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    try {
      setDeletingId(id);
      await orderService.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (error) {
      onError('Error al eliminar la orden');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="order-list-loading">
        <div className="spinner" aria-label="Cargando órdenes"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-list-empty">
        <p>No hay órdenes disponibles</p>
        <Link to="/orders/new" className="btn btn-primary">
          Crear primera orden
        </Link>
      </div>
    );
  }

  return (
    <div className="order-list">
      <div className="order-list-header">
        <h2>Lista de Órdenes</h2>
        <Link to="/orders/new" className="btn btn-primary">
          Nueva Orden
        </Link>
      </div>

      <table className="order-table" aria-label="Lista de órdenes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.productName}</td>
              <td>{order.quantity}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <span className={`status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td className="actions">
                <Link
                  to={`/orders/${order.id}`}
                  className="btn btn-secondary"
                  aria-label={`Ver detalles de orden ${order.id}`}
                >
                  Ver
                </Link>
                <Link
                  to={`/orders/${order.id}/edit`}
                  className="btn btn-secondary"
                  aria-label={`Editar orden ${order.id}`}
                >
                  Editar
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(order.id)}
                  disabled={deletingId === order.id}
                  aria-label={`Eliminar orden ${order.id}`}
                >
                  {deletingId === order.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}