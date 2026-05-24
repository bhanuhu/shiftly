import { api } from "@/lib/api";
import { chartSeries, statusDistribution, zones } from "@/services/mock-data";
import { ApiResponse, Booking, DashboardMetrics, Driver, Payment } from "@/types";

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request;
  return response.data.data;
}

export const adminApi = {
  dashboard: () => unwrap(api.get<ApiResponse<DashboardMetrics>>("/api/v1/admin/dashboard")),
  drivers: () => unwrap(api.get<ApiResponse<Driver[]>>("/api/v1/admin/drivers")),
  bookings: () => unwrap(api.get<ApiResponse<Booking[]>>("/api/v1/admin/bookings")),
  payments: () => unwrap(api.get<ApiResponse<Payment[]>>("/api/v1/admin/payments")),
  analytics: async () => ({
    ...(await unwrap(api.get<ApiResponse<Record<string, unknown>>>("/api/v1/admin/analytics"))),
      chartSeries,
      zones,
      statusDistribution
  }),
  approveDriver: (id: string) => api.patch(`/api/v1/admin/drivers/${id}/approve`),
  rejectDriver: (id: string) => api.patch(`/api/v1/admin/drivers/${id}/reject`),
  suspendDriver: (id: string) => api.patch(`/api/v1/admin/drivers/${id}/suspend`),
  assignDriver: (bookingId: string, driverId: string) =>
    api.patch(`/api/v1/admin/bookings/${bookingId}/assign-driver`, null, { params: { driver_id: driverId } }),
  cancelBooking: (id: string) => api.patch(`/api/v1/admin/bookings/${id}/cancel`)
};
