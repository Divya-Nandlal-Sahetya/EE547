import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { GetEvents } from "./listeventApi";
import { CreateEvent } from "./createeventApi";
import { setTokens } from "./tokens";
import Calendar from "react-calendar";
import Switch from "@mui/material/Switch";
import { Button } from "@mui/material";
import uscbg from "./uscbg.png";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import SendMail from "./sendMail";
import { ShowEmailList } from "./showEmailList";
import GetPersons from "./GetPersons";
import GetGradebook from "./GetGradebook";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from,
} from "@apollo/client";
function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}



const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

const mdTheme = createTheme();

export default function DashboardContent({
	signOut,
	createGoogleAuthLink,
	isLoggedIn,
	isGmailEnabled,
	setEventChanged,
	selectedDate,
	eventChanged,
	setSelectedDate,
	emailid,
	client,
}) {
	const [open, setOpen] = React.useState(true);

	const [isTeacher, setIsTeacher] = React.useState(() =>
		sessionStorage.getItem("isTeacher") || false
	);

	const toggleDrawer = () => {
		setOpen(!open);
	};

	React.useEffect(() => {
		console.log("setISTeacher: ", isTeacher);
	}, [isTeacher]);

	const label = { inputProps: { "aria-label": "Switch demo" } };

	return (
		<ThemeProvider theme={mdTheme}>
			<Box className="main-box" sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar
					position="absolute"
					open={open}
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-around",
					}}
				>
					<Toolbar
						sx={{
							pr: "24px", // keep right padding when drawer closed
						}}
					>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							Dashboard
						</Typography>
					</Toolbar>

					{!isLoggedIn ? (
						// <Button
						// 	variant="contained"
						// 	color="error"
						// 	onClick={() => {
						// 		console.log("Button click...", createGoogleAuthLink);
						// 		createGoogleAuthLink();
						// 	}}
						// >
						// 	Login
						// </Button>
						<></>
					) : (
						// <button onClick={createGoogleAuthLink}>Login</button>
						<Button variant="contained" color="error" onClick={signOut}>
							Sign Out
						</Button>
					)}
				</AppBar>

				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: "100vh",
						// overflow: "auto",
						display: "flex",
						width: "100vh",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Toolbar />

					{isLoggedIn ? (
						<Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
							<Grid container spacing={3} style={{ height: "80vh" }}>
								{/* Chart */}
								<Grid item xs={12} md={8} lg={9} style={{ height: "inherit" }}>
									<Paper
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "column",
											overflow: "auto",
											// height: 240,
										}}
										style={{
											height: "50%",
											marginBottom: "10px",
										}}
									>
										{/* <Chart /> */}
										<SendMail isLoggedIn={isLoggedIn} />
										<ShowEmailList
											isLoggedIn={isLoggedIn}
											isGmailEnabled={isGmailEnabled}
										/>
									</Paper>

									{/* Academics*/}
									<Paper
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "column",
											height: "50%",
											// overflow: 'scroll'
										}}
									>
										<ApolloProvider client={client}>
											{/* <GetPersons emailid={emailid} isTeacher={isTeacher} /> */}
											<GetGradebook emailid={emailid}  />
										</ApolloProvider>
									</Paper>
								</Grid>

								{/* Recent Deposits */}
								<Grid item xs={12} md={4} lg={3}>
									<Paper
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "column",
											// height: 240,
										}}
									>
										<CreateEvent
											isLoggedIn={isLoggedIn}
											setEventChanged={setEventChanged}
										/>
										<Calendar onChange={(prev) => setSelectedDate(prev)} />
										<div>
											<GetEvents
												isLoggedIn={isLoggedIn}
												selectedDate={selectedDate}
												eventChanged={eventChanged}
												setEventChanged={setEventChanged}
											/>
										</div>
									</Paper>
								</Grid>
							</Grid>
						</Container>
					) : (
						<Container style={{ width: "auto" }}>
							<Paper
								sx={{
									p: 2,
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									height: 240,
									width: 540,
								}}
							>
								Login to access Dashboard
								<FormGroup>
									<FormControlLabel
										control={<Switch defaultChecked={false} color="warning" />}
										onChange={(event) => {
											setIsTeacher(event.target.checked);
											sessionStorage.setItem("isTeacher", event.target.checked);
										}}
										label={isTeacher ? "Teacher" : "Student"}
									/>
								</FormGroup>
								<Button
									variant="contained"
									color="error"
									onClick={() => {
										console.log("Button click...", createGoogleAuthLink);
										createGoogleAuthLink();
									}}
								>
									Login
								</Button>
							</Paper>
						</Container>
					)}
				</Box>
			</Box>
		</ThemeProvider>
	);
}

// export default function Dashboard() {
//   return <DashboardContent />;
// }
