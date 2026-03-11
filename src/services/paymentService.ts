const API_BASE_URL = 'https://localhost:7259/api/admin/payment';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// ============ Types ============

export interface PaymentOrder {
  id: number;
  orderCode: number;
  userId: number;
  userEmail: string;
  userFullName: string;
  orderType: 'course_purchase' | 'subscription';
  referenceId: number;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  payOSTransactionId: string | null;
  createdAt: string;
  paidAt: string | null;
}

export interface PaymentOrdersResponse {
  items: PaymentOrder[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaymentOrderParams {
  page?: number;
  pageSize?: number;
  status?: 'pending' | 'paid' | 'cancelled' | 'expired';
  orderType?: 'course_purchase' | 'subscription';
  fromDate?: string;
  toDate?: string;
  searchKeyword?: string;
}

export interface RevenueByMonth {
  year: number;
  month: number;
  totalRevenue: number;
  transactionCount: number;
}

export interface RevenueByType {
  orderType: 'course_purchase' | 'subscription';
  totalRevenue: number;
  transactionCount: number;
}

export interface RevenueSummaryResponse {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  monthOverMonthGrowthPercent: number;
  totalTransactions: number;
  paidTransactions: number;
  pendingTransactions: number;
  revenueByMonth: RevenueByMonth[];
  revenueByType: RevenueByType[];
}

// ============ API Functions ============

/**
 * API 1: Lấy danh sách toàn bộ giao dịch trong hệ thống
 * GET /api/admin/payment/orders
 */
export const getPaymentOrders = async (params: PaymentOrderParams = {}): Promise<PaymentOrdersResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.orderType) queryParams.append('orderType', params.orderType);
  if (params.fromDate) queryParams.append('fromDate', params.fromDate);
  if (params.toDate) queryParams.append('toDate', params.toDate);
  if (params.searchKeyword) queryParams.append('searchKeyword', params.searchKeyword);

  const url = `${API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment orders');
  }

  return response.json();
};

/**
 * API 2: Lấy chi tiết 1 giao dịch cụ thể theo Id
 * GET /api/admin/payment/orders/{id}
 */
export const getPaymentOrderById = async (id: number): Promise<PaymentOrder> => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment order detail');
  }

  return response.json();
};

/**
 * API 3: Lấy thống kê doanh thu tổng quan
 * GET /api/admin/payment/revenue/summary
 */
export const getRevenueSummary = async (): Promise<RevenueSummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/revenue/summary`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch revenue summary');
  }

  return response.json();
};

/**
 * API 4: Đồng bộ thủ công trạng thái các đơn pending với PayOS
 * POST /api/admin/payment/sync
 */
export const syncPaymentStatus = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sync`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to sync payment status');
  }
};
