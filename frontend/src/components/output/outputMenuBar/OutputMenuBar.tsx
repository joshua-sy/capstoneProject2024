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
    return (
        <nav className={styles.navBar}>
            <ul className={styles.navList}>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'Graph' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('Graph')}
                    draggable
                    onDragStart={() => onDragStartTab(tab)}
                >
                    Graphs
                </li>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'Terminal Output' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('Terminal Output')}
                    draggable
                    onDragStart={() => onDragStartTab(tab)}
                >
                    Terminal Output
                </li>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'CodeGPT' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('CodeGPT')}
                    draggable
                    onDragStart={() => onDragStartTab(tab)}
                >
                    CodeGPT
                </li>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'LLVMIR' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('LLVMIR')}
                    draggable
                    onDragStart={() => onDragStartTab(tab)}
                >
                    LLVMIR
                </li>
            </ul>
        </nav>
    );
};

export default OutputMenuBar;
