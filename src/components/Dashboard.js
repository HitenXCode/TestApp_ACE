import React from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import { useUserContext } from "./UserProvider";

const Navbar = () => {
  const { userRole } = useUserContext();
  const storedUserRole = localStorage.getItem("userRole");
  const roleToDisplay = storedUserRole || userRole;
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "flex-end", gap: "1rem" }}>
        {roleToDisplay ? (
          <Button
            component={Link}
            to={"/admin"}
            variant="contained"
            color="error"
          >
            AdminPanel
          </Button>
        ) : (
          <br />
        )}
        <Button component={Link} to={"/"} variant="contained" color="error">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const DashBoard = () => {
  return (
    <div className="App">
      <Navbar />
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "2.5em",
          width: "50%",
          margin: "auto",
          marginTop: "10%",
          boxShadow: "1px 1px 3px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Button
            component={Link}
            to={"/list"}
            variant="contained"
            color="primary"
          >
            Start Voting
          </Button>
          <Button
            component={Link}
            to={"/list/results"}
            variant="contained"
            color="secondary"
          >
            Show Voting Results
          </Button>
        </div>
        <Typography variant="h5" textAlign="center" marginTop="5%">
          Welcome To Dish Polling App, Start Polling..
        </Typography>
      </Paper>
    </div>
  );
};

export default DashBoard;
