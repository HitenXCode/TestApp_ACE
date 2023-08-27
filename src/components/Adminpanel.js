import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import usersData from "../db/users.json"; // Sample user data from your JSON file

const AdminWrapper = styled(Paper)(({ theme }) => ({
  width: "80%",
  padding: "1em",
  textAlign: "center",
  margin: "2em auto",
  backgroundColor: "#ECECEC",
}));

const StyledLink = styled(Button)(({ theme }) => ({
  textDecoration: "none",
  display: "flex",
  color: "white",
  backgroundColor: "#9c27b0",
  alignItems: "center",
  left: "1%",
  marginTop: "1%",
  width: "10%",
  marginBottom: "1rem",
}));

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [dishes, setDishes] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from session storage or use the initial data from users.json
    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(usersData);
    }
    // Fetch dishes from local storage
    const storedDishes = JSON.parse(localStorage.getItem("itemList"));
    if (storedDishes) {
      setDishes(storedDishes);
    }
  }, []);

  const handleDelete = (userId) => {
    setDeleteUserId(userId); // Set the user ID to delete in the state
    setOpenDeleteConfirmation(true); // Open the delete confirmation dialog
  };

  const handleDeleteConfirmation = () => {
    if (deleteUserId !== null) {
      const deletedUser = users.find((user) => user.id === deleteUserId);

      // Update the dishes' points based on the deleted user's choices
      const updatedDishes = dishes.map((dish) => {
        if (dish.id === deletedUser.choices.rank1) {
          dish.points -= 30;
        }
        if (dish.id === deletedUser.choices.rank2) {
          dish.points -= 20;
        }
        if (dish.id === deletedUser.choices.rank3) {
          dish.points -= 10;
        }
        return dish;
      });

      // Delete user from the state and local storage
      const updatedUsers = users.filter((user) => user.id !== deleteUserId);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update dishes in local storage
      localStorage.setItem("itemList", JSON.stringify(updatedDishes));

      // Close the delete confirmation dialog and reset deleteUserId
      setOpenDeleteConfirmation(false);
      setDeleteUserId(null);
    }
  };

  const handleEditOpen = (user) => {
    setEditedUser(user);
    setEditedUsername(user.username);
    setEditedPassword(user.password);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditedUser(null);
    setEditedUsername("");
    setEditedPassword("");
  };

  const handleEditSave = () => {
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id
        ? { ...user, username: editedUsername, password: editedPassword }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    handleEditClose();
  };

  return (
    <div>
      {/* <StyledLink to={"/dashboard"}>{"< "}Dashboard</StyledLink> */}
      <StyledLink onClick={() => navigate(-1)} to={""}>
        &lt; Back
      </StyledLink>
      <AdminWrapper>
        <Typography
          variant="h4"
          color="secondary"
          style={{ fontFamily: "Roboto" }}
        >
          Admin Panel
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Rank 1</TableCell>
                <TableCell>Rank 2</TableCell>
                <TableCell>Rank 3</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Rank 1 Position</TableCell>
                <TableCell>Rank 2 Position</TableCell>
                <TableCell>Rank 3 Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(
                (user) =>
                  !user.isAdmin && (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {(user.choices.rank1 > 0 &&
                          dishes.find((dish) => dish.id === user.choices.rank1)
                            ?.dishName) ||
                          0}
                      </TableCell>
                      <TableCell>
                        {(user.choices.rank2 > 0 &&
                          dishes.find((dish) => dish.id === user.choices.rank2)
                            ?.dishName) ||
                          0}
                      </TableCell>
                      <TableCell>
                        {(user.choices.rank3 > 0 &&
                          dishes.find((dish) => dish.id === user.choices.rank3)
                            ?.dishName) ||
                          0}
                      </TableCell>
                      <TableCell>
                        {user.choices.rank1 > 0 &&
                        user.choices.rank2 > 0 &&
                        user.choices.rank3 > 0
                          ? dishes.find(
                              (dish) => dish.id === user.choices.rank1
                            )?.points +
                            dishes.find(
                              (dish) => dish.id === user.choices.rank2
                            )?.points +
                            dishes.find(
                              (dish) => dish.id === user.choices.rank3
                            )?.points
                          : 0}
                      </TableCell>
                      <TableCell>
                        {user.choices.rank1 > 0
                          ? dishes.findIndex(
                              (dish) => dish.id === user.choices.rank1
                            ) + 1
                          : 0}
                      </TableCell>
                      <TableCell>
                        {user.choices.rank2 > 0
                          ? dishes.findIndex(
                              (dish) => dish.id === user.choices.rank2
                            ) + 1
                          : 0}
                      </TableCell>
                      <TableCell>
                        {user.choices.rank3 > 0
                          ? dishes.findIndex(
                              (dish) => dish.id === user.choices.rank3
                            ) + 1
                          : 0}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditOpen(user)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography
          variant="h4"
          color="secondary"
          style={{ marginTop: "1em", fontFamily: "Roboto" }}
        >
          Dishes and User Ranks
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dish</TableCell>
                <TableCell>Rank 1</TableCell>
                <TableCell>Rank 2</TableCell>
                <TableCell>Rank 3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dishes.map((dish) => (
                <TableRow key={dish.id}>
                  <TableCell>{dish.dishName}</TableCell>
                  <TableCell>
                    {users
                      .filter((user) => user.choices.rank1 === dish.id)
                      .map((user) => user.username)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    {users
                      .filter((user) => user.choices.rank2 === dish.id)
                      .map((user) => user.username)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    {users
                      .filter((user) => user.choices.rank3 === dish.id)
                      .map((user) => user.username)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminWrapper>

      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            label="Username"
            variant="outlined"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            fullWidth
          />
          <br />
          <br />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteConfirmation}
        onClose={() => setOpenDeleteConfirmation(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user data and rankings?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmation}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
