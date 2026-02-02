// components/AnalysisModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { X } from 'lucide-react';
import LoadingDots from './LoadingDots';

const AnalysisModal = ({ open, onClose, loading, analysis, error }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 1,
        }}
      >
        <Typography variant="h6">Trace Analysis</Typography>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 'auto',
            padding: 0.5,
          }}
        >
          <X size={20} />
        </Button>
      </DialogTitle>

      <DialogContent
        sx={{
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Analyzing your journal entries
            </Typography>
            <LoadingDots size="medium" color="primary" />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'error.main', mb: 2 }}>
              {error}
            </Typography>
          </Box>
        ) : analysis ? (
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                mb: 2,
                fontSize: '0.85rem',
              }}
            >
              Analysis based on {analysis.entry_count} journal entries from the last{' '}
              {analysis.analysis_period_days} days
            </Typography>
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {analysis.insights}
            </Typography>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisModal;
