import { Box, Button, Container, Typography } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };
  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container maxWidth="sm">
          <Box sx={{ my: 10 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Oops, there is an error!
            </Typography>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </Button>
          </Box>
        </Container>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
