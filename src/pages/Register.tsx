import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FirebaseError } from "firebase/app";
import { firebaseErrorMessage } from "../utils/errorHandling";

const Register = () => {
  const { user } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        alert(firebaseErrorMessage(e.code));
      } else {
        alert(e);
        console.error(e);
      }
    }
  };

  return (
    <>
      {user ? (
        <Navigate to={`/DividendManage/`} />
      ) : (
        <>
          <Grid>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: "280px",
                m: "20px auto",
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Typography variant={"h5"} sx={{ m: "10px" }}>
                  新規登録
                </Typography>
              </Grid>
              <Box component={"form"} onSubmit={handleSubmit}>
                <TextField
                  label="メールアドレス"
                  variant="standard"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginTop: "10px" }}
                  fullWidth
                  required
                />
                <TextField
                  type="password"
                  label="パスワード"
                  variant="standard"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginTop: "10px" }}
                  fullWidth
                  required
                />
                <Box mt={4}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    登録
                  </Button>
                </Box>
                <Box
                  sx={{
                    marginTop: "10px",
                    textAlign: "right",
                    fontSize: "0.9rem",
                  }}
                >
                  <Link href="/DividendManage/login">ログイン画面へ</Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </>
      )}
    </>
  );
};

export default Register;
