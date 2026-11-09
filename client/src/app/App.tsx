import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@shared/components/Layout';
import { OrderList } from '@features/orders/OrderList';
import { OrderForm } from '@features/orders/OrderForm';
import { OrderDetail } from '@features/orders/OrderDetail';
import { OrderEntity } from '../features/orders/types';

const App = () => {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [location.pathname]);

  const handleOrderCreated = (newOrder: OrderEntity) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const handleOrderUpdated = (updatedOrder: OrderEntity) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OrderList orders={orders} onDelete={handleOrderDeleted} />} />
        <Route
          path="/orders/new"
          element={<OrderForm onOrderCreated={handleOrderCreated} />}
        />
        <Route
          path="/orders/:id/edit"
          element={<OrderForm onOrderUpdated={handleOrderUpdated} />}
        />
        <Route
          path="/orders/:id"
          element={<OrderDetail onDelete={handleOrderDeleted} />}
        />
      </Routes>
    </Layout>
  );
};

export default App;