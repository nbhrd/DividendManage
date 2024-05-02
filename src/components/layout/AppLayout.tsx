import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../common/SideBar";
import { useAppContext } from "../../context/AppContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Dividend } from "../../types";
import { isFireStoreError } from "../../utils/errorHandling";
import { useAuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const drawerWidth = 240;

export default function AppLayout() {
  const { setDividends, setIsLoading } = useAppContext();
  const { user } = useAuthContext();

  // firestoreのデータを全て取得
  React.useEffect(() => {
    const fetchDividends = async () => {
      try {
        const q = query(
          collection(db, "Dividends"),
          where("uid", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);
        const dividendsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Dividend;
        });

        setDividends(dividendsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreのエラー:", err);
        } else {
          console.error("一般的なエラー:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDividends();
  }, [user]);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
    }
  };

  return (
    <>
      {user ? (
        <>
          <Box
            sx={{
              display: { md: "flex" },
              bgcolor: (theme) => theme.palette.grey[100],
              minHeight: "100vh",
            }}
          >
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  配当管理アプリ
                </Typography>
                <div style={{ flexGrow: 1 }}></div>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  style={{ backgroundColor: "white" }}
                >
                  ログアウト
                </Button>
              </Toolbar>
            </AppBar>

            <SideBar
              drawerWidth={drawerWidth}
              mobileOpen={mobileOpen}
              handleDrawerTransitionEnd={handleDrawerTransitionEnd}
              handleDrawerClose={handleDrawerClose}
            />

            {/* メインコンテンツ */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { md: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Toolbar />
              <Outlet />
            </Box>
          </Box>
        </>
      ) : (
        <Navigate to={`/login`} />
      )}
    </>
  );
}
