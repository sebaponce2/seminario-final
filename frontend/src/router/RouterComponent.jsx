import { Route, Routes, Outlet } from "react-router-dom";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { RecoverPasswordScreen } from "../screens/RecoverPasswordScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { Navbar } from "../componentes/Navbar";
import { CreatePostScreen } from "../screens/CreatePostScreen";
import { RecordScreen } from "../screens/RecordScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { HomeAdminScreen } from "../screens/HomeAdminScreen";
import { PostDescriptionScreen } from "../screens/PostDescriptionScreen";
import { SelectPostScreen } from "../screens/SelectPostScreen";
import { MyPostsScreen } from "../screens/MyPostsScreen";
import { MyChatsScreen } from "../screens/MyChatsScreen";
import { MyBarteringHistory } from "../screens/MyBarteringHistory";
import { BarteringDetails } from "../screens/MyBarteringDetails";
import { PostRequestsList } from "../screens/PostRequestsList";

const AppLayout = () => {
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
      <Route path="/" element={<AppLayout />}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/createPost" element={<CreatePostScreen />} />
        <Route path="/recordValidation" element={<RecordScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/homeAdmin" element={<HomeAdminScreen />} />
        <Route path="/detailsPost" element={<PostDescriptionScreen />} />
        <Route path="/requestsList" element={<PostRequestsList />} />
        <Route path="/selectPost" element={<SelectPostScreen />} />
        <Route path="/myPosts" element={<MyPostsScreen />} />
        <Route path="/chats" element={<MyChatsScreen />} />
        <Route path="/barteringHistory" element={<MyBarteringHistory />} />
        <Route path="/barteringDetails" element={<BarteringDetails />} />
      </Route>
    </Routes>
  );
};
