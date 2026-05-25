import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DestructiveConfirmDialog } from '@/components/shared/DestructiveConfirmDialog';
import { Trash2, CheckCircle2, XCircle, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStockRelations } from '../hooks/useStockRelations';
import { useStockRelationDelete } from '../hooks/useStockRelationDelete';
import type { StockRelationDto } from '../types';


interface StockRelationListProps {
  stockId: number;
}

export function StockRelationList({ stockId }: StockRelationListProps): ReactElement {
  const { t } = useTranslation();
  const { data: relations, isLoading } = useStockRelations(stockId);
  const deleteRelation = useStockRelationDelete();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [relationToDelete, setRelationToDelete] = useState<StockRelationDto | null>(null);

  const handleDeleteClick = (relation: StockRelationDto): void => {
    setRelationToDelete(relation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (relationToDelete) {
      await deleteRelation.mutateAsync({
        id: relationToDelete.id,
        stockId,
      });
      setDeleteDialogOpen(false);
      setRelationToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
         </div>
         <div className="space-y-2">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
         </div>
      </div>
    );
  }

  if (!relations || relations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl bg-zinc-50/50 dark:bg-white/5 transition-all hover:bg-zinc-50 dark:hover:bg-white/10">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-sm mb-4">
            <Link className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
            {t('stock.relations.noRelations')}
        </h3>
        <p className="text-sm text-zinc-500 text-center max-w-xs">
            {t('stock.relations.noRelationsDesc')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-zinc-200 dark:border-white/10">
              <TableHead className="w-[120px] font-semibold text-zinc-700 dark:text-zinc-300">
                {t('stock.relations.stockCode')}
              </TableHead>
              <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">
                {t('stock.relations.stockName')}
              </TableHead>
              <TableHead className="text-center font-semibold text-zinc-700 dark:text-zinc-300">
                {t('stock.relations.quantity')}
              </TableHead>
              <TableHead className="text-center font-semibold text-zinc-700 dark:text-zinc-300">
                {t('stock.relations.isMandatory')}
              </TableHead>
              <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">
                {t('stock.relations.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relations.map((relation) => (
              <TableRow 
                key={relation.id} 
                className="group border-zinc-200 dark:border-white/5 hover:bg-zinc-50/80 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {relation.relatedStockCode || '-'}
                </TableCell>
                <TableCell className="font-medium text-zinc-800 dark:text-zinc-200">
                  {relation.relatedStockName || '-'}
                </TableCell>
                <TableCell className="text-center font-medium">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs">
                        {relation.quantity}
                    </span>
                </TableCell>
                <TableCell className="text-center">
                  {relation.isMandatory ? (
                    <Badge variant="default" className="bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800 gap-1.5 shadow-none font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('stock.relations.mandatory')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 gap-1.5 shadow-none font-medium">
                      <XCircle className="h-3 w-3" />
                      {t('stock.relations.optional')}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="
                        h-8 w-8 p-0 
                        text-zinc-400 hover:text-red-600 
                        hover:bg-red-50 dark:hover:bg-red-950/20 
                        rounded-lg transition-all
                        opacity-0 group-hover:opacity-100 focus:opacity-100
                    "
                    onClick={() => handleDeleteClick(relation)}
                    disabled={deleteRelation.isPending}
                    title={t('stock.relations.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DestructiveConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setRelationToDelete(null);
        }}
        title={t('stock.relations.deleteConfirm')}
        description={t('stock.relations.deleteConfirmMessage', {
          name: relationToDelete?.relatedStockName || '',
        })}
        cancelLabel={t('common.no', { defaultValue: 'Hayır' })}
        confirmLabel={t('stock.relations.confirmDeleteAction', { defaultValue: 'Evet, sil' })}
        pendingLabel={t('stock.relations.deleting')}
        isPending={deleteRelation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
