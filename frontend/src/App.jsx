import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import Navbar from "./components/Navbar";
import AIAssistant from "./components/AIAssistant";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <BrowserRouter>

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={
            <Home
              openAIChat={() => setIsAIChatOpen(true)}
            />
          }
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

        </Route>

      </Routes>


      {/* AI Assistant */}

      <AIAssistant
        isOpen={isAIChatOpen}
        setIsOpen={setIsAIChatOpen}
      />

    </BrowserRouter>
  );
}

export default App;