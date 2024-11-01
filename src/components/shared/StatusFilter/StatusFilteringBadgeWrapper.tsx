import StatusFilteringBadge from "./StatusFilteringBadge";

interface StatusFilter {
  value: string;
  label: string;
}

interface IStatusFilteringBadgeWrapper {
  statusList: { [key: string]: number };
  statusFilters: StatusFilter[];
  activeStatusBadge: string;
  onClickHandler: (value: string) => void;
  counter: string;
}

const StatusFilteringBadgeWrapper = ({
  statusList,
  statusFilters,
  activeStatusBadge,
  onClickHandler,
  counter,
}: IStatusFilteringBadgeWrapper) => {

  console.log("statusList", statusList);
console.log("statusFilters", statusFilters);

console.log("activeStatusBadge", activeStatusBadge);


  return (
    <div className="mt-4 flex flex-row flex-wrap gap-6">
      <StatusFilteringBadge
        name={"all"}
        value={"all"}
        counter={counter}
        filterActive={activeStatusBadge}
        onClickHandler={onClickHandler}
      />

      {statusFilters.map(
        (statusFilter: { value: string; label: string }, index: number) => {
          const count = statusList[statusFilter.value] || 0;

          return (
            <StatusFilteringBadge
              key={index}
              name={statusFilter.label}
              value={statusFilter.value}
              counter={count.toString()}
              filterActive={activeStatusBadge}
              onClickHandler={onClickHandler}
            />
          );
        },
      )}
    </div>
  );
};

export default StatusFilteringBadgeWrapper;
