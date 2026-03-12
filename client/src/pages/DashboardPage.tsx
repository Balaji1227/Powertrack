import React, { useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Paper, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, TextField,
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { BoltOutlined, AttachMoney, Co2, Speed } from '@mui/icons-material';
import { useAppDispatch, useEnergy, useAuth } from '../hooks';
import { fetchSummary, fetchTrend, fetchRegionData, setFilters } from '../store/slices/energySlice';
import { Region, MeterType } from '../types';

// ── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactElement;
  color: string;
}
const KpiCard: React.FC<KpiCardProps> = ({ title, value, sub, icon, color }) => (
  <Paper elevation={2} sx={{ p: 3, borderLeft: `5px solid ${color}`, borderRadius: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight={700} mt={0.5}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{sub}</Typography>
      </Box>
      <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
    </Box>
  </Paper>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summary, trend, regionData, filters, isLoading } = useEnergy();
  const { user } = useAuth();

  const loadData = useCallback(() => {
    dispatch(fetchSummary(filters));
    dispatch(fetchTrend(filters));
    if (user?.role !== 'Viewer') dispatch(fetchRegionData(filters));
  }, [dispatch, filters, user?.role]);

  useEffect(() => { loadData(); }, [loadData]);

  const fmt = (n?: number, decimals = 1) =>
    n != null ? n.toLocaleString('en-US', { maximumFractionDigits: decimals }) : '—';

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={1}>Energy Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Welcome back, {user?.name} · Role: <strong>{user?.role}</strong>
      </Typography>

      {/* ── Filters ── */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth size="small" type="date" label="Start Date"
              value={filters.startDate} InputLabelProps={{ shrink: true }}
              onChange={(e) => dispatch(setFilters({ startDate: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth size="small" type="date" label="End Date"
              value={filters.endDate} InputLabelProps={{ shrink: true }}
              onChange={(e) => dispatch(setFilters({ endDate: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region} label="Region"
                onChange={(e) => dispatch(setFilters({ region: e.target.value as Region }))}
              >
                {['All', 'North', 'South', 'East', 'West', 'Central'].map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Meter Type</InputLabel>
              <Select
                value={filters.meterType} label="Meter Type"
                onChange={(e) => dispatch(setFilters({ meterType: e.target.value as MeterType }))}
              >
                {['All', 'residential', 'commercial', 'industrial'].map((m) => (
                  <MenuItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                title="Total Consumption" value={`${fmt(summary?.totalConsumption)} kWh`}
                sub={`${fmt(summary?.readingCount, 0)} readings`}
                icon={<BoltOutlined fontSize="large" />} color="#1F4E79"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                title="Total Cost" value={`$${fmt(summary?.totalCost)}`}
                sub="USD billed" icon={<AttachMoney fontSize="large" />} color="#2E7D32"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                title="Carbon Emissions" value={`${fmt(summary?.totalCarbon)} kg`}
                sub="CO₂ equivalent" icon={<Co2 fontSize="large" />} color="#C62828"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                title="Avg Peak Demand" value={`${fmt(summary?.avgPeakDemand)} kW`}
                sub="across all meters" icon={<Speed fontSize="large" />} color="#E65100"
              />
            </Grid>
          </Grid>

          {/* ── Trend Chart ── */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" mb={2}>Consumption Trend (kWh)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F4E79" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1F4E79" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone" dataKey="consumption" stroke="#1F4E79"
                  fill="url(#colorConsumption)" strokeWidth={2}
                  name="Consumption (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>

          {/* ── Cost + Region Charts ── */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>Daily Cost (USD)</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cost" stroke="#2E7D32" strokeWidth={2} dot={false} name="Cost ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {user?.role !== 'Viewer' && regionData.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" mb={2}>Consumption by Region (kWh)</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="totalConsumption" fill="#1F4E79" radius={[4, 4, 0, 0]} name="kWh" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardPage;
