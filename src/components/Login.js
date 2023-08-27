
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useUserContext } from "./UserProvider";

//const users = require("../db/users.json");

const useInputField = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange,
  };
};

const Login = () => {
  const userName = useInputField("");
  const password = useInputField("");
  const navigate = useNavigate();
  const { updateUserRole } = useUserContext();
  const users = JSON.parse(localStorage.getItem("users"));
 
  const login = () => {
    // console.log(users);
    const user = users.find((user) => user.username === userName.value);
    if (!user) {
      Toast.error("No user found");
      return;
    }

    if (user.password !== password.value) {
      Toast.error("Incorrect Password");
      return;
    }

    // Update user role context
    updateUserRole(user.isAdmin);

    // Save user data to local storage
    localStorage.setItem("loginuser", JSON.stringify(user));

    Toast.success("Login successfully!");
    if (user.isAdmin) {
      // Assuming this is the point where userRole is determined
      localStorage.setItem("userRole", true);
    } else {
      localStorage.setItem("userRole", false);
    }
    navigate("/dashboard");
  };

  return (
    <>
      <Typography variant="h3" textAlign="center" marginTop="5%">
        Dish Polling Web App
      </Typography>
      <Paper
        sx={{
          width: 450,
          margin: "5em auto",
          padding: "1em",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          boxShadow: "1px 1px 3px",
        }}
      >
        <Typography variant="h4">Login</Typography>
        <TextField
          label="User Name"
          variant="outlined"
          {...userName}
          required
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          {...password}
          required
        />
        <Button variant="contained" onClick={login}>
          Login
        </Button>
      </Paper>
    </>
  );
};

export default Login;
