import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { firebaseErrorMessage } from "../utils/errorHandling";

const Login = () => {
  const { user } = useAuthContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
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
        <Navigate to={`/`} />
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
                  ログイン
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
                    送信
                  </Button>
                </Box>
                <Box
                  sx={{
                    marginTop: "10px",
                    textAlign: "right",
                    fontSize: "0.9rem",
                  }}
                >
                  <Link href="/register">新規登録画面へ</Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </>
      )}
    </>
  );
};

export default Login;
