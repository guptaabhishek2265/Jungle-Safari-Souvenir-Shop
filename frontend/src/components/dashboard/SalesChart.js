import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  ButtonGroup,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TrendingUp, ShowChart } from "@mui/icons-material";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

const SalesChart = ({
  data = [],
  title = "Safari Sales Trend",
  height = 350,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("line");

  // Default data if not provided
  const defaultData = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [12500, 15000, 10800, 8900, 21550, 16200, 19300],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [45000, 58700, 63200, 72300],
    },
    year: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: [
        134000, 148000, 156000, 165000, 172000, 195000, 201000, 215000, 226000,
        235000, 248000, 260000,
      ],
    },
  };

  // Format currency (in INR)
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Calculate total and growth
  const getTotalSales = () => {
    const currentData = data[timeRange]?.data || defaultData[timeRange].data;
    return currentData.reduce((sum, val) => sum + val, 0);
  };

  const getGrowthRate = () => {
    const currentData = data[timeRange]?.data || defaultData[timeRange].data;
    if (currentData.length < 2) return 0;

    const lastValue = currentData[currentData.length - 1];
    const prevValue = currentData[currentData.length - 2];

    if (prevValue === 0) return 100;
    return Math.round(((lastValue - prevValue) / prevValue) * 100);
  };

  // Chart configuration
  const getChartOptions = () => {
    const selectedData = data[timeRange] || defaultData[timeRange];

    return {
      chart: {
        id: "safari-sales-chart",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        background: "transparent",
        fontFamily: theme.typography.fontFamily,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: chartType === "area" ? "smooth" : "straight",
        width: chartType === "bar" ? 0 : 3,
        lineCap: "round",
        colors: ["#2e7d32"], // Jungle green
      },
      fill: {
        type: chartType === "area" ? "gradient" : "solid",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.4,
          gradientToColors: ["#ff9800"], // Amber accent
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.3,
          stops: [0, 100],
        },
      },
      colors: ["#2e7d32"], // Jungle green
      xaxis: {
        categories: selectedData.labels,
        labels: {
          style: {
            colors: "#e0e0e0",
            fontSize: "12px",
            fontFamily: theme.typography.fontFamily,
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
          position: "back",
          stroke: {
            color: "#2e7d32",
            width: 1,
            dashArray: 3,
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => formatCurrency(value),
          style: {
            colors: "#e0e0e0",
            fontSize: "12px",
            fontFamily: theme.typography.fontFamily,
          },
        },
      },
      grid: {
        borderColor: "#2e4a39", // Dark jungle border
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => formatCurrency(value),
        },
        x: {
          show: true,
        },
        marker: {
          show: false,
        },
        style: {
          fontFamily: theme.typography.fontFamily,
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      markers: {
        size: 5,
        colors: ["#2e7d32"], // Jungle green
        strokeColors: "#1a3829", // Dark jungle background
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      annotations:
        chartType === "line" || chartType === "area"
          ? {
              position: "front",
              yaxis: [
                {
                  y:
                    getTotalSales() /
                    (data[timeRange]?.data.length ||
                      defaultData[timeRange].data.length),
                  borderColor: "#ff9800",
                  borderWidth: 2,
                  strokeDashArray: 3,
                  label: {
                    borderColor: "#ff9800",
                    style: {
                      color: "#fff",
                      background: "#ff9800",
                      padding: {
                        left: 8,
                        right: 8,
                        top: 2,
                        bottom: 2,
                      },
                      fontSize: "10px",
                    },
                    text: "Avg. Sales",
                    position: "left",
                  },
                },
              ],
            }
          : {},
    };
  };

  const getChartSeries = () => {
    const selectedData = data[timeRange] || defaultData[timeRange];

    return [
      {
        name: "Safari Sales",
        data: selectedData.data,
      },
    ];
  };

  const growthRate = getGrowthRate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          backgroundImage:
            "linear-gradient(145deg, var(--card-background), rgba(26, 56, 41, 0.7))",
          boxShadow: "0 10px 20px var(--shadow-color)",
          overflow: "hidden",
          position: "relative",
          height: "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0a9 9 0 0 0-9 9v30a9 9 0 0 0 9 9h30a9 9 0 0 0 9-9V9a9 9 0 0 0-9-9H9zm0 2h30a7 7 0 0 1 7 7v30a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7zm13 12a2 2 0 1 0-4 0v14a2 2 0 1 0 4 0v-3.513l12.84 8.139a2 2 0 1 0 2.16-3.372L24.157 21l12.836-8.243a2 2 0 1 0-2.155-3.374L22 17.513V14z' fill='%232e7d32' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
            borderRadius: "20px",
            opacity: 0.5,
            zIndex: 0,
          },
          "&::after": {
            content: '"🏕️"',
            position: "absolute",
            fontSize: "40px",
            opacity: 0.1,
            bottom: "20px",
            right: "20px",
            zIndex: 0,
          },
          border: "1px solid rgba(46, 125, 50, 0.2)",
        }}
        className={className}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                "& svg": {
                  mr: 1,
                  color: "var(--primary-light)",
                },
              }}
              className="sales-chart-title"
            >
              <ShowChart /> {title}
            </Typography>
            <Chip
              icon={<TrendingUp />}
              label={`${growthRate > 0 ? "+" : ""}${growthRate}%`}
              color={growthRate >= 0 ? "success" : "error"}
              size="small"
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                background:
                  growthRate >= 0
                    ? "rgba(102, 187, 106, 0.15)"
                    : "rgba(239, 83, 80, 0.15)",
                color:
                  growthRate >= 0
                    ? "var(--success-color)"
                    : "var(--error-color)",
                border: "none",
              }}
            />
          </Box>

          <ButtonGroup
            variant="outlined"
            size="small"
            aria-label="time range toggle"
            sx={{
              ".MuiButtonGroup-grouped": {
                borderColor: "rgba(46, 125, 50, 0.3)",
                "&:not(:last-of-type)": {
                  borderRightColor: "rgba(46, 125, 50, 0.3)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(46, 125, 50, 0.15)",
                  color: "var(--primary-light)",
                  borderColor: "var(--primary-color)",
                  fontWeight: 600,
                },
                "&:hover": {
                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                },
              },
            }}
          >
            <Button
              onClick={() => setTimeRange("week")}
              variant={timeRange === "week" ? "contained" : "outlined"}
              sx={{
                color: timeRange === "week" ? "white" : "var(--primary-color)",
                backgroundColor:
                  timeRange === "week" ? "var(--primary-color)" : "transparent",
                borderColor: "var(--primary-color)",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                },
              }}
            >
              Week
            </Button>
            <Button
              onClick={() => setTimeRange("month")}
              variant={timeRange === "month" ? "contained" : "outlined"}
              sx={{
                color: timeRange === "month" ? "white" : "var(--primary-color)",
                backgroundColor:
                  timeRange === "month"
                    ? "var(--primary-color)"
                    : "transparent",
                borderColor: "var(--primary-color)",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                },
              }}
            >
              Month
            </Button>
            <Button
              onClick={() => setTimeRange("year")}
              variant={timeRange === "year" ? "contained" : "outlined"}
              sx={{
                color: timeRange === "year" ? "white" : "var(--primary-color)",
                backgroundColor:
                  timeRange === "year" ? "var(--primary-color)" : "transparent",
                borderColor: "var(--primary-color)",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                },
              }}
            >
              Year
            </Button>
          </ButtonGroup>

          <ButtonGroup
            variant="outlined"
            size="small"
            aria-label="chart type toggle"
            sx={{
              ".MuiButtonGroup-grouped": {
                borderColor: "rgba(46, 125, 50, 0.3)",
                "&:not(:last-of-type)": {
                  borderRightColor: "rgba(46, 125, 50, 0.3)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(46, 125, 50, 0.15)",
                  color: "var(--primary-light)",
                  borderColor: "var(--primary-color)",
                  fontWeight: 600,
                },
                "&:hover": {
                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                },
              },
            }}
          >
            <Button
              onClick={() => setChartType("line")}
              variant={chartType === "line" ? "contained" : "outlined"}
              sx={{
                minWidth: 0,
                px: 1.5,
                color: chartType === "line" ? "white" : "var(--primary-color)",
                backgroundColor:
                  chartType === "line" ? "var(--primary-color)" : "transparent",
                borderColor: "var(--primary-color)",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                },
              }}
            >
              Line
            </Button>
            <Button
              onClick={() => setChartType("area")}
              variant={chartType === "area" ? "contained" : "outlined"}
              sx={{
                minWidth: 0,
                px: 1.5,
                color: chartType === "area" ? "white" : "var(--primary-color)",
                backgroundColor:
                  chartType === "area" ? "var(--primary-color)" : "transparent",
                borderColor: "var(--primary-color)",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                },
              }}
            >
              Area
            </Button>
            <Button
              onClick={() => setChartType("bar")}
              variant={chartType === "bar" ? "contained" : "outlined"}
              sx={{
                minWidth: 0,
                px: 1.5,
                color: chartType === "bar" ? "white" : "var(--primary-color)",
                backgroundColor:
                  chartType === "bar" ? "var(--primary-color)" : "transparent",
                borderColor: "var(--primary-color)",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                },
              }}
            >
              Bar
            </Button>
          </ButtonGroup>
        </Box>

        <Divider
          sx={{
            mb: 3,
            opacity: 0.5,
            borderColor: "var(--border-color)",
            position: "relative",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography variant="body2" color="var(--text-secondary)">
              Total Sales (
              {timeRange === "week"
                ? "This Week"
                : timeRange === "month"
                ? "This Month"
                : "This Year"}
              )
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mt: 0.5,
                background:
                  "linear-gradient(to right, var(--text-primary), var(--accent-color))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {formatCurrency(getTotalSales())}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="var(--text-secondary)">
              Average Per{" "}
              {timeRange === "week"
                ? "Day"
                : timeRange === "month"
                ? "Week"
                : "Month"}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mt: 0.5,
                background:
                  "linear-gradient(to right, var(--accent-color), var(--secondary-color))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {formatCurrency(
                Math.round(
                  getTotalSales() /
                    (data[timeRange]?.data.length ||
                      defaultData[timeRange].data.length)
                )
              )}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            height: `${height - 170}px`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Chart
            options={getChartOptions()}
            series={getChartSeries()}
            type={chartType}
            height={isMobile ? 300 : height - 170}
            width="100%"
          />
        </Box>
      </Paper>
    </motion.div>
  );
};

export default SalesChart;
