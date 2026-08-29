import React from "react";
import styles from "../styles/DateRangeFilter.module.css";

export default function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange }) {
    return (
        <div className={styles.filterContainer}>
            <label>Desde:</label>
            <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => onStartChange(e.target.value)}
            />

            <label>Hasta:</label>
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => onEndChange(e.target.value)}
            />
        </div>
    );
}