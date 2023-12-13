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
  console.log(props, "props");
  const classes = useStyles();
  const walletIcons = {
    injected: "/injectedicon.svg",
    metaMask: "/metamaskicon.svg",
    coinbaseWallet: "/coinbaseicon.svg",
    walletConnect: "/walletconnecticon.svg",
  };
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
          size={250}
          thickness={1}
          value={100}
        />
        <CircularProgress
          variant="determinate"
          size={250}
          thickness={1}
          value={props.value}
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
          <Typography
            variant="caption"
            className="flex flex-col justify-center items-center text-2xl font-medium text-text-mode"
            component="div"
            color="text.secondary"
          >
            <img
              src={walletIcons[props?.selectedWallet]}
              width={90}
              height={83}
              alt="img"
            />
            <p className="text-2xl font-medium text-text-mode">
              {props.selectedWallet}
            </p>
          </Typography>
        </Box>
      </Box>
    </>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function ConnectWalletProgress({
  selectedWallet,
  isSuccess,
  data,
}) {
  const [progress, setProgress] = React.useState(25);
  React.useEffect(() => {
    isSuccess && data && setProgress(100);
  }, [isSuccess, data]);
  return (
    <CircularProgressWithLabel
      value={progress}
      selectedWallet={selectedWallet}
    />
  );
}
