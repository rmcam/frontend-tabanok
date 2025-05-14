import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { LeaderboardEntry } from '@/types/gamificationTypes';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  index: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry, index }) => {
  return (
    <TableRow key={entry.userId}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{entry.username}</TableCell>
      <TableCell>{entry.totalPoints}</TableCell>
      <TableCell>{entry.level}</TableCell>
      {/* Agrega otras celdas si es necesario */}
    </TableRow>
  );
};

export default LeaderboardRow;