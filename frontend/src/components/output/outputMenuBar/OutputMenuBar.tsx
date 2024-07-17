// MenuBar.tsx
import React, { useState } from 'react';
import styles from './outputMenuBar.module.css';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

interface OutputMenuBarProps {
    setCurrentOutput: (outputType: OutputType) => void;
}

const OutputMenuBar: React.FC<OutputMenuBarProps> =({
    setCurrentOutput
}) => {


    return (
        <div>
            <nav className={styles.navBar}>
                <ul className={styles.navList}>
                    <li className={styles.navItem} onClick={() => setCurrentOutput('Graph')}>Graphs</li>
                    <li className={styles.navItem} onClick={() => setCurrentOutput('Terminal Output')}>Terminal Output</li>
                    <li className={styles.navItem} onClick={() => setCurrentOutput('CodeGPT')}>CodeGPT</li>
                    <li className={styles.navItem} onClick={() => setCurrentOutput('LLVMIR')}>LLVMIR</li>
                </ul>
            </nav>
        </div>
    );
};

export default OutputMenuBar;