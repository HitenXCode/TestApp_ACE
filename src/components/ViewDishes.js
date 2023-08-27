import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import styled from "styled-components";
import Toast from "react-hot-toast";
import styles from "../Styles/dish.module.css";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import usersData from "../db/users.json";

const DishWrapper = styled(Paper)({
  width: "80%",
  padding: "1em",
  textAlign: "center",
  margin: "2em auto",
});

const StyledLink = styled(Button)({
  textDecoration: "none",
  display: "flex",
  color: "white",
  backgroundColor: "#9c27b0",
  alignItems: "center",
  left: "1%",
  marginTop: "1%",
  marginBottom: "1rem",
});

const ViewDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [rank1, setRank1] = useState(null);
  const [rank2, setRank2] = useState(null);
  const [rank3, setRank3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [votingInProcess, setVotingInProcess] = useState(false);
  const navigate = useNavigate();
  const loginuser = JSON.parse(localStorage.getItem("loginuser"));

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await axios.get(
        "https://raw.githubusercontent.com/syook/react-dishpoll/main/db.json"
      );
      setDishes(response.data);
      if (!localStorage.getItem("itemList")) {
        localStorage.setItem("itemList", JSON.stringify(response.data));
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchDishes();
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(usersData);
    }
  }, []);

  // Handle vote button for polling ...
  // handle rank functions
  const rankOne = (id) => {
    // switch rank between different item
    if (id !== rank2 && id !== rank3) {
      setRank1(id);
    }

    // switch rank within same item
    if (id === rank2) {
      setRank2(null);
      setRank1(id);
    }
    if (id === rank3) {
      setRank3(null);
      setRank1(id);
    }
  };

  const rankTwo = (id) => {
    if (id !== rank1 && id !== rank3) {
      setRank2(id);
    }
    if (id === rank1) {
      setRank1(null);
      setRank2(id);
    }
    if (id === rank3) {
      setRank3(null);
      setRank2(id);
    }
  };

  const rankThree = (id) => {
    if (id !== rank1 && id !== rank2) {
      setRank3(id);
    }
    if (id === rank1) {
      setRank1(null);
      setRank3(id);
    }
    if (id === rank2) {
      setRank2(null);
      setRank3(id);
    }
  };

  // polling dish function
  function updateItem(id, val) {
    let arr = JSON.parse(localStorage.getItem("itemList"));
    let newItemList = arr.map((item) => {
      if (item.id === id) {
        if (item?.points) {
          item.points += val;
        } else item.points = val;
      } else {
        if (!item?.points) item.points = 0;
      }
      return item;
    });

    newItemList.sort((a, b) => {
      return parseFloat(b.points) - parseFloat(a.points);
    });
    localStorage.setItem("itemList", JSON.stringify(newItemList));
  }
  const userId = localStorage.getItem("loginuser");

  // Check if the user has already made choices
  let userChoices = JSON.parse(localStorage.getItem("userChoices"));
  const hasMadeChoices = userChoices && userChoices.userId === userId;

  // handle vote button for polling
  const handleVote = () => {
    if (!hasMadeChoices) {
      setVotingInProcess(true);
      updateItem(rank1, 30);
      updateItem(rank2, 20);
      updateItem(rank3, 10);

      let userChoices = {
        userId: userId,
        rank1: rank1,
        rank2: rank2,
        rank3: rank3,
      };

      //console.log(rank1,rank2,rank3);
      //add ranks into 'users' in local storage
      const updatedUsers = users.map((user) =>
        user.id === loginuser.id
          ? {
              ...user,
              choices: {
                rank1: rank1,
                rank2: rank2,
                rank3: rank3,
              },
            }
          : user
      );
      setUsers(updatedUsers);
      //console.log(users);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // navigate('/dashboard'); // Redirect back to dashboard or other appropriate page
      setTimeout(() => {
        setVotingInProcess(false);
        Toast.success("Request successfull!", {
          position: "top-right",
        });
        navigate("/list/results");
      }, 1000);

      // Save user choices in local storage or send to server
      localStorage.setItem("userChoices", JSON.stringify(userChoices));
      //console.log(userChoices);
    } else {
      Toast.error("You have already made choices");
    }
  };

  const handleeditVote = () => {
    setVotingInProcess(true);

    //console.log(uch);
    if (hasMadeChoices) {
      userChoices = JSON.parse(localStorage.getItem("userChoices"));
    }
    //Subtract previous points from the user's previous choices
    if (userChoices) {
      updateItem(userChoices.rank1, -30);
      updateItem(userChoices.rank2, -20);
      updateItem(userChoices.rank3, -10);
    }

    updateItem(rank1, 30);
    updateItem(rank2, 20);
    updateItem(rank3, 10);

    const newuserChoices = {
      userId: userId,
      rank1: rank1,
      rank2: rank2,
      rank3: rank3,
    };

    //add ranks into 'users' in local storage
    const updatedUsers = users.map((user) =>
      user.id === loginuser.id
        ? {
            ...user,
            choices: {
              rank1: rank1,
              rank2: rank2,
              rank3: rank3,
            },
          }
        : user
    );
    setUsers(updatedUsers);
    console.log(users);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // navigate('/dashboard'); // Redirect back to dashboard or other appropriate page
    setTimeout(() => {
      setVotingInProcess(false);
      Toast.success("changes saved succesfully", {
        position: "top-right",
      });
      navigate("/list/results");
    }, 1000);

    // Save user choices in local storage or send to server
    localStorage.setItem("userChoices", JSON.stringify(newuserChoices));
  };

  return (
    <>
      <StyledLink onClick={() => navigate(-1)} to={""}>
        &lt; Back
      </StyledLink>
      <DishWrapper elevation={3}>
        {rank1 && rank2 && rank3 ? (
          <Button
            variant="contained"
            className={styles.voteBtn}
            onClick={handleVote}
          >
            {votingInProcess ? "Proccessing" : "Vote"}
          </Button>
        ) : (
          <Button variant="contained" className={styles.disableBtn} disabled>
            Vote
          </Button>
        )}
        {"  "}
        {rank1 && rank2 && rank3 ? (
          <Button variant="contained" onClick={handleeditVote}>
            Edit & SAVE Choice
          </Button>
        ) : (
          <Button variant="contained" className={styles.disableBtn} disabled>
            Edit & SAVE Choice
          </Button>
        )}

        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
          >
            <CircularProgress size={100} />
          </Box>
        ) : (
          <>
            <ul>
              {dishes.map((dish) => (
                <Card key={dish.id} sx={{ marginTop: "5%" }}>
                  <CardContent sx={{ width: "100%" }}>
                    <img src={dish.image} alt="dish-img" width={200} />
                    <Typography variant="h6">{dish.dishName}</Typography>
                    <CardActions className={styles.rankContainer}>
                      <Button
                        onClick={() => rankOne(dish.id)}
                        className={
                          rank1 === dish.id ? styles.rankActiveBtn : styles.rank
                        }
                      >
                        1
                      </Button>

                      <Button
                        onClick={() => rankTwo(dish.id)}
                        className={
                          rank2 === dish.id ? styles.rankActiveBtn : styles.rank
                        }
                      >
                        2
                      </Button>
                      <Button
                        onClick={() => rankThree(dish.id)}
                        className={
                          rank3 === dish.id ? styles.rankActiveBtn : styles.rank
                        }
                      >
                        3
                      </Button>
                    </CardActions>
                    <Typography>{dish.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            </ul>
          </>
        )}
      </DishWrapper>
    </>
  );
};

export default ViewDishes;
