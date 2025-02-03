import React, {JSX} from 'react';

function MainLayout({children}: {children: React.ReactNode}): JSX.Element {
    return (
        <main className={'flex flex-col relative h-svh overflow-hidden inset-0'}>
            {children}
        </main>
    );
}

export default MainLayout;