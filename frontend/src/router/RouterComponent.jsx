import { Route, Routes } from "react-router-dom";
import { LoginScreen } from "../screens/LoginScreen";

export const RouterComponent = () => {
  return (
    <>
      <Routes>
        <Route>
          <Route path="/" element={<LoginScreen />} />
        </Route>
        <Route>
          <Route path="/login" element={<LoginScreen />} />
        </Route>
      </Routes>
    </>
  );
};
