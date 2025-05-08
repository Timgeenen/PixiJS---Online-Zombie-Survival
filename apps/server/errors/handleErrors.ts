export function handleCatchError(error: unknown) {
    if (error instanceof Error) {
        console.error(error.name);
        console.error(error.message);
    } else {
        console.error('An unknown error occurred: ', error);
    }
}
