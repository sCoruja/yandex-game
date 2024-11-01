import React from "react";
import Typography from "@mui/material/Typography";

import styles from "./styles.module.css";
import logo from "../../assets/svg/logo.svg";
import { Link } from "react-router-dom";

export type LayoutProps = {
    children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img
                        className={styles["logo-icon"]}
                        src={logo}
                        alt="app logo"
                    />
                    <Typography variant="h1" sx={{ fontSize: "24px" }}>
                        @scoruja/yandex-game
                    </Typography>
                </div>
                <nav>
                    <ul className={styles.list}>
                        <li className={styles["list-item"]}>
                            <Link to="/" className={styles.link}>
                                <Typography variant="button">
                                    Start page
                                </Typography>
                            </Link>
                        </li>
                        <li className={styles["list-item"]}>
                            <Link to="/game" className={styles.link}>
                                <Typography variant="button">Play</Typography>
                            </Link>
                        </li>
                        <li className={styles["list-item"]}>
                            <Link to="/forum" className={styles.link}>
                                <Typography variant="button">Forum</Typography>
                            </Link>
                        </li>
                        <li className={styles["list-item"]}>
                            <Link to="/leaderboard" className={styles.link}>
                                <Typography variant="button">
                                    Leaderboard
                                </Typography>
                            </Link>
                        </li>
                        <li className={styles["list-item"]}>
                            <Link to="/profile" className={styles.link}>
                                <Typography variant="button">
                                    Profile
                                </Typography>
                            </Link>
                        </li>
                        <li className={styles["list-item"]}>
                            <Link to="/register" className={styles.link}>
                                <Typography variant="button">
                                    Sign Up
                                </Typography>
                            </Link>
                        </li>
                        <li className={styles["list-item"]}>
                            <Link to="/login" className={styles.link}>
                                <Typography variant="button">
                                    Sign In
                                </Typography>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className={styles.main}>{children}</main>
        </>
    );
};
