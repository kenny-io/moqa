import { WebhookRequest } from '@/lib/types';

export function convertRequestsToCSV(requests: WebhookRequest[]): string {
  const headers = [
    'Timestamp',
    'Method',
    'Source IP',
    'Headers',
    'Query Parameters',
    'Body'
  ];

  const rows = requests.map(request => [
    request.timestamp,
    request.method,
    request.source_ip,
    JSON.stringify(request.headers),
    JSON.stringify(request.query_params),
    request.body
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        const escaped = cell.toString().replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add to document, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); 
}