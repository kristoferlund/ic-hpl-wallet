import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { DrawerHook } from "../../hooks/drawerHook";
import { UseTransaction } from "../../hooks/useTransaction";
import { TableHook } from "@/hooks/tableHook";
import { GeneralHook } from "../../hooks/generalHook";
import clsx from "clsx";

export default function TransactionList() {
  const { selectedTransaction, changeSelectedTransaction } = UseTransaction();
  const { setDrawerOpen } = DrawerHook();
  const { transactions } = GeneralHook();

  const { columns, sorting, setSorting } = TableHook();

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full max-h-[calc(100vh-11.25rem)] scroll-y-light">
      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <thead className="border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SecondaryColorLight dark:bg-SecondaryColor sticky top-0 z-[1]">
          {table.getHeaderGroups().map((headerGroup, idxTR) => (
            <tr key={`tr-transac-${idxTR}`}>
              {headerGroup.headers.map((header, idxTH) => (
                <th key={`th-transac-${idxTH}`} className={colStyle(idxTH)}>
                  <div
                    {...{
                      className: idxTH === 2 && header.column.getCanSort() ? "cursor-pointer select-none" : "",
                      onClick: idxTH === 2 ? header.column.getToggleSortingHandler() : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, idxTR) => (
            <tr
              className={`border-b border-b-BorderColorTwoLight dark:border-b-BorderColorTwo cursor-pointer ${
                (selectedTransaction?.hash && selectedTransaction?.hash === row.original.hash) ||
                (selectedTransaction?.idx && selectedTransaction?.idx === row.original.idx)
                  ? "bg-SelectRowColor/10"
                  : ""
              }`}
              key={`tr-transac-${idxTR}`}
              onClick={() => {
                changeSelectedTransaction(row.original);
                setDrawerOpen(true);
              }}
            >
              {row.getVisibleCells().map((cell, idxTD) => (
                <td key={`tr-transac-${idxTD}`} className={colStyle(idxTD)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const colStyle = (idxTH: number) =>
  clsx({
    ["realtive"]: true,
    ["w-[5rem] min-w-[5rem] max-w-[5rem]"]: idxTH === 0,
    ["w-[calc(55%-5rem)] min-w-[calc(55%-5rem)] max-w-[calc(55%-5rem)]"]: idxTH === 1,
    ["w-[20%] min-w-[20%] max-w-[20%]"]: idxTH === 2,
    ["w-[25%] min-w-[25%] max-w-[25%]"]: idxTH === 3,
  });
