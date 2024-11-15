import { Route, Routes, Outlet } from "react-router-dom";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { RecoverPasswordScreen } from "../screens/RecoverPasswordScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { Navbar } from "../componentes/Navbar";
import { CreateProductScreen } from "../screens/CreateProductScreen";

const ProductsLayout = () => {
  return (
    <>
      <Navbar /> 
      <Outlet /> 
    </>
  );
};

export const RouterComponent = () => {
  return (
    <Routes>
      {/* Rutas sin Navbar */}
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/recoverPassword" element={<RecoverPasswordScreen />} />
      
      {/* Rutas con Navbar */}
      <Route path="/" element={<ProductsLayout />}>
        <Route path="/products" element={<HomeScreen />} />
        <Route path="/createProduct" element={<CreateProductScreen />} />
      </Route>
    </Routes>
  );
};
