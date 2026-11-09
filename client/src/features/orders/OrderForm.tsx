import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderService } from '@services/order.service';
import { validateOrderForm, type OrderFormData } from '@shared/validation/order.validation';
import type { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@services/order.service';

interface OrderFormProps {
  onError: (message: string) => void;
}

export function OrderForm({ onError }: OrderFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const orderService = new OrderService();

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    productName: '',
    quantity: 1,
    price: 0,
    status: 'PENDING'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      loadOrder(id);
    }
  }, [id, isEditing]);

  const loadOrder = async (orderId: string) => {
    try {
      setInitialLoading(true);
      const order = await orderService.getOrder(orderId);
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        productName: order.productName,
        quantity: order.quantity,
        price: order.price,
        status: order.status
      });
    } catch (error) {
      onError('Error al cargar la orden');
      navigate('/orders');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateOrderForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && id) {
        const updateData: UpdateOrderDto = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          productName: formData.productName,
          quantity: formData.quantity,
          price: formData.price,
          status: formData.status
        };
        await orderService.updateOrder(id, updateData);
      } else {
        const createData: CreateOrderDto = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          productName: formData.productName,
          quantity: formData.quantity,
          price: formData.price
        };
        await orderService.createOrder(createData);
      }
      
      navigate('/orders');
    } catch (error) {
      onError(`Error al ${isEditing ? 'actualizar' : 'crear'} la orden`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="order-form-loading">
        <div className="spinner" aria-label="Cargando orden"></div>
        <p>Cargando orden...</p>
      </div>
    );
  }

  return (
    <div className="order-form">
      <h2>{isEditing ? 'Editar Orden' : 'Nueva Orden'}</h2>
      
      <form onSubmit={handleSubmit} aria-label={`Formulario de ${isEditing ? 'edición' : 'creación'} de orden`}>
        <div className="form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={errors.customerName ? 'error' : ''}
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
          />
          {errors.customerName && (
            <span id="customerName-error" className="error-message">
              {errors.customerName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Email del Cliente</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            className={errors.customerEmail ? 'error' : ''}
            aria-invalid={Boolean(errors.customerEmail)}
            aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
          />
          {errors.customerEmail && (
            <span id="customerEmail-error" className="error-message">
              {errors.customerEmail}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="productName">Nombre del Producto</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={errors.productName ? 'error' : ''}
            aria-invalid={Boolean(errors.productName)}
            aria-describedby={errors.productName ? 'productName-error' : undefined}
          />
          {errors.productName && (
            <span id="productName-error" className="error-message">
              {errors.productName}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Cantidad</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={errors.quantity ? 'error' : ''}
              aria-invalid={Boolean(errors.quantity)}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio Unitario</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
              aria-invalid={Boolean(errors.price)}
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="PENDING">Pendiente</option>
              <option value="PROCESSING">Procesando</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        )}

        <div className="form-summary">
          <span>Total: </span>
          <strong>${(formData.quantity * formData.price).toFixed(2)}</strong>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/orders')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}