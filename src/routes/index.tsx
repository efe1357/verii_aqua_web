import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { RouteErrorFallback } from '@/components/shared/RouteErrorFallback';
import { ForbiddenPage } from '@/components/shared/ForbiddenPage';
import { getAppBasePath } from '@/lib/api-config';
import { ensureFeatureNamespacesReady } from '@/lib/i18n';
import { measureAsync } from '@/lib/performance';

const lazyImport = <T extends Record<string, unknown>, K extends keyof T>(
  factory: () => Promise<T>,
  name: K,
  features?: string | string[],
) =>
  lazy(async () => {
    const module = await measureAsync(`route-chunk:${String(name)}`, async () => {
      const [loadedModule] = await Promise.all([
        factory(),
        ...(features ? [ensureFeatureNamespacesReady(features)] : []),
      ]);
      return loadedModule;
    });
    return { default: module[name] as ComponentType };
  });

const LazyMainLayout = lazy(async () => {
  const module = await import('@/components/shared/MainLayout');
  return { default: module.MainLayout };
});

const LazyAuthLayout = lazy(async () => {
  const module = await import('@/layouts/AuthLayout');
  return { default: module.default };
});

const LoginPage = lazyImport(() => import('@/features/auth/components/LoginPage.tsx'), 'LoginPage', 'auth');
const ResetPasswordPage = lazyImport(() => import('@/features/auth/components/ResetPasswordPage.tsx'), 'ResetPasswordPage', 'auth');
const ForgotPasswordPage = lazyImport(() => import('@/features/auth/components/ForgotPasswordPage.tsx'), 'ForgotPasswordPage', 'auth');
const UserManagementPage = lazyImport(() => import('@/features/user-management/components/UserManagementPage.tsx'), 'UserManagementPage', 'user-management');
const MailSettingsPage = lazyImport(() => import('@/features/mail-settings/pages/MailSettingsPage.tsx'), 'MailSettingsPage', 'mail-settings');
const StockListPage = lazyImport(() => import('@/features/stock/components/StockListPage.tsx'), 'StockListPage', 'stock');
const StockDetailPage = lazyImport(() => import('@/features/stock/components/StockDetailPage.tsx'), 'StockDetailPage', 'stock');
const PermissionDefinitionsPage = lazyImport(() => import('@/features/access-control/components/PermissionDefinitionsPage.tsx'), 'PermissionDefinitionsPage', 'access-control');
const PermissionGroupsPage = lazyImport(() => import('@/features/access-control/components/PermissionGroupsPage.tsx'), 'PermissionGroupsPage', 'access-control');
const UserGroupAssignmentsPage = lazyImport(() => import('@/features/access-control/components/UserGroupAssignmentsPage.tsx'), 'UserGroupAssignmentsPage', 'access-control');
const HangfireMonitoringPage = lazyImport(() => import('@/features/hangfire-monitoring'), 'HangfireMonitoringPage', 'hangfire-monitoring');
const NetsisMirrorCustomersPage = lazyImport(() => import('@/features/netsis-mirror'), 'NetsisMirrorCustomersPage', 'netsis-mirror');
const NetsisMirrorStocksPage = lazyImport(() => import('@/features/netsis-mirror'), 'NetsisMirrorStocksPage', 'netsis-mirror');
const NetsisMirrorWarehousesPage = lazyImport(() => import('@/features/netsis-mirror'), 'NetsisMirrorWarehousesPage', 'netsis-mirror');
const NetsisMirrorBranchesPage = lazyImport(() => import('@/features/netsis-mirror'), 'NetsisMirrorBranchesPage', 'netsis-mirror');
const ProfilePage = lazyImport(() => import('@/features/user-detail-management/components/ProfilePage.tsx'), 'ProfilePage', 'user-detail-management');
const ProjectsPage = lazyImport(() => import('@/features/projects'), 'ProjectsPage', ['aqua', 'projects']);
const CagesPage = lazyImport(() => import('@/features/cages'), 'CagesPage', ['aqua', 'cages']);
const CageWarehouseMappingsPage = lazyImport(() => import('@/features/cages'), 'CageWarehouseMappingsPage', ['aqua', 'cages']);
const ProjectCageAssignmentsPage = lazyImport(() => import('@/features/project-cages'), 'ProjectCageAssignmentsPage', ['aqua', 'project-cages']);
const WeatherSeveritiesPage = lazyImport(() => import('@/features/weather'), 'WeatherSeveritiesPage', ['aqua', 'weather']);
const WeatherTypesPage = lazyImport(() => import('@/features/weather'), 'WeatherTypesPage', ['aqua', 'weather']);
const SeaWaterTemperaturesPage = lazyImport(() => import('@/features/sea-water-temperature'), 'SeaWaterTemperaturesPage', ['aqua', 'sea-water-temperature']);
const WindDirectionsPage = lazyImport(() => import('@/features/wind-direction'), 'WindDirectionsPage', ['aqua', 'wind-direction']);
const CurrentDirectionsPage = lazyImport(() => import('@/features/current-direction'), 'CurrentDirectionsPage', ['aqua', 'current-direction']);
const NetOperationTypesPage = lazyImport(() => import('@/features/net-operations'), 'NetOperationTypesPage', ['aqua', 'net-operations']);
const AquaSettingsPage = lazyImport(() => import('@/features/aqua-settings'), 'AquaSettingsPage', 'aqua');
const GoodsReceiptsPage = lazyImport(() => import('@/features/goods-receipts'), 'GoodsReceiptsPage', ['aqua', 'goods-receipts']);
const FeedingsPage = lazyImport(() => import('@/features/feedings'), 'FeedingsPage', ['aqua', 'feedings']);
const MortalitiesPage = lazyImport(() => import('@/features/mortalities'), 'MortalitiesPage', ['aqua', 'mortalities']);
const TransfersPage = lazyImport(() => import('@/features/transfers'), 'TransfersPage', ['aqua', 'transfers']);
const WarehouseTransfersPage = lazyImport(() => import('@/features/transfers'), 'WarehouseTransfersPage', ['aqua', 'transfers']);
const CageWarehouseTransfersPage = lazyImport(() => import('@/features/transfers'), 'CageWarehouseTransfersPage', ['aqua', 'transfers']);
const WarehouseCageTransfersPage = lazyImport(() => import('@/features/transfers'), 'WarehouseCageTransfersPage', ['aqua', 'transfers']);
const ShipmentsPage = lazyImport(() => import('@/features/shipments'), 'ShipmentsPage', ['aqua', 'shipments']);
const WeighingsPage = lazyImport(() => import('@/features/weighings'), 'WeighingsPage', ['aqua', 'weighings']);
const StockConvertsPage = lazyImport(() => import('@/features/stock-converts'), 'StockConvertsPage', ['aqua', 'stock-converts']);
const FishBatchesPage = lazyImport(() => import('@/features/fish-batches'), 'FishBatchesPage', ['aqua', 'fish-batches']);
const DailyWeathersPage = lazyImport(() => import('@/features/daily-weathers'), 'DailyWeathersPage', ['aqua', 'daily-weathers']);
const NetOperationsPage = lazyImport(() => import('@/features/net-operations'), 'NetOperationsPage', ['aqua', 'net-operations']);
const GoodsReceiptLinesPage = lazyImport(() => import('@/features/goods-receipts'), 'GoodsReceiptLinesPage', ['aqua', 'goods-receipts']);
const GoodsReceiptFishDistributionsPage = lazyImport(() => import('@/features/goods-receipts'), 'GoodsReceiptFishDistributionsPage', ['aqua', 'goods-receipts']);
const FeedingLinesPage = lazyImport(() => import('@/features/feedings'), 'FeedingLinesPage', ['aqua', 'feedings']);
const FeedingDistributionsPage = lazyImport(() => import('@/features/feedings'), 'FeedingDistributionsPage', ['aqua', 'feedings']);
const TransferLinesPage = lazyImport(() => import('@/features/transfers'), 'TransferLinesPage', ['aqua', 'transfers']);
const WarehouseTransferLinesPage = lazyImport(() => import('@/features/transfers'), 'WarehouseTransferLinesPage', ['aqua', 'transfers']);
const CageWarehouseTransferLinesPage = lazyImport(() => import('@/features/transfers'), 'CageWarehouseTransferLinesPage', ['aqua', 'transfers']);
const WarehouseCageTransferLinesPage = lazyImport(() => import('@/features/transfers'), 'WarehouseCageTransferLinesPage', ['aqua', 'transfers']);
const ShipmentLinesPage = lazyImport(() => import('@/features/shipments'), 'ShipmentLinesPage', ['aqua', 'shipments']);
const MortalityLinesPage = lazyImport(() => import('@/features/mortalities'), 'MortalityLinesPage', ['aqua', 'mortalities']);
const WeighingLinesPage = lazyImport(() => import('@/features/weighings'), 'WeighingLinesPage', ['aqua', 'weighings']);
const StockConvertLinesPage = lazyImport(() => import('@/features/stock-converts'), 'StockConvertLinesPage', ['aqua', 'stock-converts']);
const NetOperationLinesPage = lazyImport(() => import('@/features/net-operations'), 'NetOperationLinesPage', ['aqua', 'net-operations']);
const BatchMovementsPage = lazyImport(() => import('@/features/batch-movements'), 'BatchMovementsPage', ['aqua', 'batch-movements']);
const CageBalancesPage = lazyImport(() => import('@/features/cage-balances'), 'CageBalancesPage', ['aqua', 'cage-balances']);
const ProjectDetailReportPage = lazyImport(() => import('@/features/project-detail-report'), 'ProjectDetailReportPage', 'aqua');
const AquaDashboardPage = lazyImport(() => import('@/features/aqua-dashboard'), 'AquaDashboardPage', 'aqua');
const RawKpiReportPage = lazyImport(() => import('@/features/raw-kpi-report'), 'RawKpiReportPage', 'aqua');
const BusinessKpiReportPage = lazyImport(() => import('@/features/business-kpi-report'), 'BusinessKpiReportPage', 'aqua');
const DevirFcrReportPage = lazyImport(() => import('@/features/devir-fcr-report'), 'DevirFcrReportPage', 'aqua');
const QuickSetupPage = lazyImport(() => import('@/features/quick-setup'), 'QuickSetupPage', 'aqua');
const QuickDailyEntryPage = lazyImport(() => import('@/features/quick-daily-entry'), 'QuickDailyEntryPage', 'aqua');
const OpeningImportPage = lazyImport(() => import('@/features/opening-import'), 'OpeningImportPage', 'aqua');
const ProjectMergesPage = lazyImport(() => import('@/features/project-merges'), 'ProjectMergesPage', 'aqua');
const WelcomePage = lazyImport(() => import('@/features/welcome'), 'WelcomePage', 'welcome');

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Suspense fallback={null}>
          <LazyMainLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      // Root/home artık dashboard olacak (redirect yok).
      { index: true, element: <AquaDashboardPage /> },
      { path: 'welcome', element: <WelcomePage /> },
      { path: 'forbidden', element: <ForbiddenPage /> },
      { path: 'user-management', element: <UserManagementPage /> },
      { path: 'users/mail-settings', element: <MailSettingsPage /> },
      { path: 'stocks', element: <StockListPage /> },
      { path: 'stocks/:id', element: <StockDetailPage /> },
      { path: 'access-control/permission-definitions', element: <PermissionDefinitionsPage /> },
      { path: 'access-control/permission-groups', element: <PermissionGroupsPage /> },
      { path: 'access-control/user-group-assignments', element: <UserGroupAssignmentsPage /> },
      { path: 'hangfire-monitoring', element: <HangfireMonitoringPage /> },
      { path: 'netsis/mirror-customers', element: <NetsisMirrorCustomersPage /> },
      { path: 'netsis/mirror-stocks', element: <NetsisMirrorStocksPage /> },
      { path: 'netsis/mirror-warehouses', element: <NetsisMirrorWarehousesPage /> },
      { path: 'netsis/mirror-branches', element: <NetsisMirrorBranchesPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'aqua/definitions/projects', element: <ProjectsPage /> },
      { path: 'aqua/definitions/cages', element: <CagesPage /> },
      { path: 'aqua/definitions/cage-warehouse-mappings', element: <CageWarehouseMappingsPage /> },
      { path: 'aqua/definitions/project-cage-assignments', element: <ProjectCageAssignmentsPage /> },
      { path: 'aqua/definitions/weather-severities', element: <WeatherSeveritiesPage /> },
      { path: 'aqua/definitions/weather-types', element: <WeatherTypesPage /> },
      { path: 'aqua/definitions/sea-water-temperatures', element: <SeaWaterTemperaturesPage /> },
      { path: 'aqua/definitions/wind-directions', element: <WindDirectionsPage /> },
      { path: 'aqua/definitions/current-directions', element: <CurrentDirectionsPage /> },
      { path: 'aqua/definitions/net-operation-types', element: <NetOperationTypesPage /> },
      { path: 'aqua/definitions/settings', element: <AquaSettingsPage /> },
      { path: 'aqua/operations/quick-setup', element: <QuickSetupPage /> },
      { path: 'aqua/operations/quick-daily-entry', element: <QuickDailyEntryPage /> },
      { path: 'aqua/operations/opening-import', element: <OpeningImportPage /> },
      { path: 'aqua/operations/project-merges', element: <ProjectMergesPage /> },
      { path: 'aqua/operations/goods-receipts', element: <GoodsReceiptsPage /> },
      { path: 'aqua/operations/feedings', element: <FeedingsPage /> },
      { path: 'aqua/operations/mortalities', element: <MortalitiesPage /> },
      { path: 'aqua/operations/transfers', element: <TransfersPage /> },
      { path: 'aqua/operations/warehouse-transfers', element: <WarehouseTransfersPage /> },
      { path: 'aqua/operations/cage-warehouse-transfers', element: <CageWarehouseTransfersPage /> },
      { path: 'aqua/operations/warehouse-cage-transfers', element: <WarehouseCageTransfersPage /> },
      { path: 'aqua/operations/shipments', element: <ShipmentsPage /> },
      { path: 'aqua/operations/weighings', element: <WeighingsPage /> },
      { path: 'aqua/operations/stock-converts', element: <StockConvertsPage /> },
      { path: 'aqua/operations/fish-batches', element: <FishBatchesPage /> },
      { path: 'aqua/operations/daily-weathers', element: <DailyWeathersPage /> },
      { path: 'aqua/operations/net-operations', element: <NetOperationsPage /> },
      { path: 'aqua/operations/goods-receipt-lines', element: <GoodsReceiptLinesPage /> },
      { path: 'aqua/operations/goods-receipt-fish-distributions', element: <GoodsReceiptFishDistributionsPage /> },
      { path: 'aqua/operations/feeding-lines', element: <FeedingLinesPage /> },
      { path: 'aqua/operations/feeding-distributions', element: <FeedingDistributionsPage /> },
      { path: 'aqua/operations/transfer-lines', element: <TransferLinesPage /> },
      { path: 'aqua/operations/warehouse-transfer-lines', element: <WarehouseTransferLinesPage /> },
      { path: 'aqua/operations/cage-warehouse-transfer-lines', element: <CageWarehouseTransferLinesPage /> },
      { path: 'aqua/operations/warehouse-cage-transfer-lines', element: <WarehouseCageTransferLinesPage /> },
      { path: 'aqua/operations/shipment-lines', element: <ShipmentLinesPage /> },
      { path: 'aqua/operations/mortality-lines', element: <MortalityLinesPage /> },
      { path: 'aqua/operations/weighing-lines', element: <WeighingLinesPage /> },
      { path: 'aqua/operations/stock-convert-lines', element: <StockConvertLinesPage /> },
      { path: 'aqua/operations/net-operation-lines', element: <NetOperationLinesPage /> },
      { path: 'aqua/reports/batch-movements', element: <BatchMovementsPage /> },
      { path: 'aqua/reports/cage-balances', element: <CageBalancesPage /> },
      { path: 'aqua/reports/project-detail', element: <ProjectDetailReportPage /> },
      { path: 'aqua/reports/raw-kpi', element: <RawKpiReportPage /> },
      { path: 'aqua/reports/business-kpi', element: <BusinessKpiReportPage /> },
      { path: 'aqua/reports/devir-fcr', element: <DevirFcrReportPage /> },
      { path: 'aqua/dashboard', element: <AquaDashboardPage /> },
    ],
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={null}>
        <LazyAuthLayout />
      </Suspense>
    ),
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={null}>
        <LazyAuthLayout />
      </Suspense>
    ),
    children: [{ index: true, element: <ResetPasswordPage /> }],
  },
], {
  basename: getAppBasePath(),
});
