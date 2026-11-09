import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OrderService } from '@services/order.service';
import type { OrderEntity } from '@services/order.service';

interface OrderDetailProps {
  onError: (message: string) => void;
}

export function OrderDetail({ onError }: OrderDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderService = new OrderService();

  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      onError('Error al cargar los detalles de la orden');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('¿Está seguro de que desea eliminar esta orden?')) {
      return;
    }

    try {
      setDeleting(true);
      await orderService.deleteOrder(id);
      navigate('/orders');
    } catch (error) {
      onError('Error al eliminar la orden');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      PROCESSING: 'Procesando',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string): string => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="order-detail-loading">
        <div className="spinner" aria-label="Cargando detalles de la orden"></div>
        <p>Cargando detalles de la orden...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-not-found">
        <p>Orden no encontrada</p>
        <Link to="/orders" className="btn btn-primary">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <div className="order-detail-header">
        <h2>Detalles de la Orden</h2>
        <div className="header-actions">
          <Link
            to={`/orders/${order.id}/edit`}
            className="btn btn-secondary"
            aria-label={`Editar orden ${order.id}`}
          >
            Editar
          </Link>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Eliminar orden ${order.id}`}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      <div className="order-detail-content">
        <section className="order-info" aria-label="Información de la orden">
          <h3>Información General</h3>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>ID de Orden</dt>
              <dd>{order.id}</dd>
            </div>
            <div className="detail-item">
              <dt>Estado</dt>
              <dd>
                <span className={getStatusClass(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
              </dd>
            </div>
            <div className="detail-item">
              <dt>Fecha de Creación</dt>
              <dd>{new Date(order.createdAt).toLocaleString('es-ES')}</dd>
            </div>
            {order.updatedAt && (
              <div className="detail-item">
                <dt>Última Actualización</dt>
                <dd>{new Date(order.updatedAt).toLocaleString('es-ES')}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="customer-info" aria-label="Información del cliente">
          <h3>Información del Cliente</h3>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>Nombre</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div className="detail-item">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${order.customerEmail}`}>
                  {order.customerEmail}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="product-info" aria-label="Información del producto">
          <h3>Información del Producto</h3>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>Producto</dt>
              <dd>{order.productName}</dd>
            </div>
            <div className="detail-item">
              <dt>Cantidad</dt>
              <dd>{order.quantity}</dd>
            </div>
            <div className="detail-item">
              <dt>Precio Unitario</dt>
              <dd>${order.price.toFixed(2)}</dd>
            </div>
            <div className="detail-item">
              <dt>Total</dt>
              <dd className="total-amount">${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        <div className="order-detail-actions">
          <Link to="/orders" className="btn btn-secondary">
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
}