import React from 'react';
import styles from './outputMenuBar.module.css';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

interface OutputMenuBarProps {
    currentOutput: OutputType;
    setCurrentOutput: (outputType: OutputType) => void;
    onDragStartTab: (tab: OutputType) => void;
}

const OutputMenuBar: React.FC<OutputMenuBarProps> = ({
    currentOutput,
    setCurrentOutput,
    onDragStartTab,
}) => {
    const tabs: OutputType[] = ['Graph', 'Terminal Output', 'CodeGPT', 'LLVMIR'];

    return (
        <nav className={styles.navBar}>
            <ul className={styles.navList}>
                {tabs.map((tab) => (
                    <li
                        key={tab}
                        className={`${styles.navItem} ${currentOutput === tab ? styles.active : ''}`}
                        onClick={() => setCurrentOutput(tab)}
                        draggable
                        onDragStart={() => onDragStartTab(tab)} // Trigger drag start
                    >
                        {tab}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default OutputMenuBar;