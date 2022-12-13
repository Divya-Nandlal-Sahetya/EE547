import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ListItem, ListItemText } from "@mui/material";

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
	marginLeft: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default function ExpandCard({ from, date, message }) {
	const [expanded, setExpanded] = React.useState(false);
    const [trunc, setTrunc] = React.useState(message)

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

    React.useEffect(() => {
        setTrunc((message.length > 75) ? message.substring(0, 75) + '...' : message)
    }, [message])
	return (
		<Card style={{ marginBottom: "5px", marginTop: "5px" }}>
			<CardContent style={{ padding: "unset" }}>
				<ListItem alignItems="flex-start">
					<ListItemText
						primary={from}
						secondary={
							<React.Fragment>
								<Typography
									sx={{ display: "inline" }}
									component="h1"
									variant="caption"
									color="text.primary"
								>
									{date}
								</Typography>

								{expanded?<></>:<>{` — ${trunc}`}</>}
							</React.Fragment>
						}
					/>
				</ListItem>
			</CardContent>
			<ExpandMore
				expand={expanded}
				onClick={handleExpandClick}
				aria-expanded={expanded}
				aria-label="show more"
			>
				<ExpandMoreIcon />
			</ExpandMore>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* <Typography> */}
            {message}
          {/* </Typography> */}
        </CardContent>
      </Collapse>
		</Card>
	);
}
