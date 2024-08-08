import React from 'react';
import styles from './outputMenuBar.module.css';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

interface OutputMenuBarProps {
    currentOutput: OutputType;
    setCurrentOutput: (outputType: OutputType) => void;
}

const OutputMenuBar: React.FC<OutputMenuBarProps> = ({
    currentOutput,
    setCurrentOutput
}) => {
    return (
        <nav className={styles.navBar}>
            <ul className={styles.navList}>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'Graph' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('Graph')}
                >
                    Graphs
                </li>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'Terminal Output' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('Terminal Output')}
                >
                    Terminal Output
                </li>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'CodeGPT' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('CodeGPT')}
                >
                    CodeGPT
                </li>
                <li 
                    className={`${styles.navItem} ${currentOutput === 'LLVMIR' ? styles.active : ''}`} 
                    onClick={() => setCurrentOutput('LLVMIR')}
                >
                    LLVMIR
                </li>
            </ul>
        </nav>
    );
};

export default OutputMenuBar;
