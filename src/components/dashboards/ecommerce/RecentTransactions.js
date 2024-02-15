import React, { useEffect, useState } from 'react';
import DashboardCard from '../../shared/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';
import { Button, Link, Typography } from '@mui/material';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${backendUrl}/sale/transactions/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setError('Invalid data format');
        console.log(data)
      }

      setLoading(false);
    } catch (error) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  fetchTransactions();
}, []);

  return (
   <DashboardCard title="Recent Transactions">
      <>
        <Timeline
          className="theme-timeline"
          sx={{
            p: 0,
            mb: '-40px',
          }}
        >
          {loading && (
            <TimelineItem>
              <TimelineOppositeContent>Loading...</TimelineOppositeContent>
            </TimelineItem>
          )}
          {error && (
            <TimelineItem>
              <TimelineOppositeContent>Error: {error}</TimelineOppositeContent>
            </TimelineItem>
          )}
          {!loading &&
            !error &&
            transactions.map((transaction, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  {formatDistanceToNow(parseISO(transaction.created_at), { addSuffix: true })}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={transaction.transaction_type === 'income' ? 'primary' : 'error'}
                    // Use the color 'error' as a fallback if transaction_type is not valid
                  />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>
                    {transaction.transaction_type} recorded for {transaction.currency}{transaction.amount}{' '}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
            <Button href="/tables/transaction" variant="outlined" color="primary" sx={{mt: "40px !important", mb:4}}>
              View all transactions
          </Button>
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
