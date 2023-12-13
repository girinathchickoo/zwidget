import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
const useStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
  MuiCircularProgress: { circle: { color: "green" } },
}));
function CircularProgressWithLabel(props) {
  const classes = useStyles();
  return (
    <>
      <svg className="absolute">
        <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
          <stop offset="1%" stopColor="#A45EFF" />
          <stop offset="90%" stopColor="#2CFFE4" />
        </linearGradient>
      </svg>
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
        }}
      >
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) =>
              theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
          }}
          size={200}
          {...props}
          thickness={2}
          value={100}
        />
        <CircularProgress
          variant="determinate"
          size={200}
          {...props}
          thickness={2}
          sx={{
            "svg circle": { stroke: "url(#linearColors)" },
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function ConnectWalletProgress() {
  const [progress, setProgress] = React.useState(100);

  return <CircularProgressWithLabel value={progress} />;
}
