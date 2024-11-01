import { Divider, Stack, Typography } from "@mui/material";

import gameScreen from "../../assets/images/platformer.jpg";
import leaderboardImg from "../../assets/images/leaderboard.jpg";
import { mainPageData } from "./data";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
export const MainPage = () => {
    return (
        <Stack gap={3}>
            <Stack direction="row" gap={3} alignItems="center">
                <img
                    src={gameScreen}
                    alt="Game screenshot"
                    className={styles.screenshot}
                />
                <Stack alignItems="center" gap={2}>
                    <Typography variant="body1">
                        {mainPageData.description}
                    </Typography>
                    <Link to={"/game"} className={styles.button}>
                        <Typography variant="body1">Play</Typography>
                    </Link>
                </Stack>
            </Stack>
            <Divider>
                <Typography>Leaderboard</Typography>
            </Divider>
            <Stack direction="row" gap={3} alignItems="center">
                <Stack alignItems="center" gap={2}>
                    <Typography variant="body1">
                        {mainPageData.leaderboard}
                    </Typography>
                    <Link to={"/leaderboard"} className={styles.button}>
                        <Typography variant="body1">
                            Go to leaderboard
                        </Typography>
                    </Link>
                </Stack>
                <img
                    src={leaderboardImg}
                    alt="Game screenshot"
                    className={styles["leaderboard-img"]}
                />
            </Stack>
            <Divider>
                <Typography>Forum</Typography>
            </Divider>
            <Stack direction="row" gap={3} alignItems="center">
                <Stack alignItems="center" gap={2}>
                    <Typography variant="body1">
                        {mainPageData.forum}
                    </Typography>
                    <Link to={"/forum"} className={styles.button}>
                        <Typography variant="body1">Go to forum</Typography>
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    );
};
