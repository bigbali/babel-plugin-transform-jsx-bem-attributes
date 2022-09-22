export const App = () => {
    return (
        <main block="0B">
            <span block="1B" />
            <span block={['2B0', '2B1', '2B2']} />
        </main>
    );
}