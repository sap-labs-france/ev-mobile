import I18n from "i18n-js";
import React from "react";
import HeaderComponent from "../../components/header/HeaderComponent";
import ComplexSearchComponent from "../../components/search/complex/ComplexSearchComponent";
import DateFilterComponent from "../../components/search/complex/filter/date/DateFilterComponent";
import MyUserSwitchFilterComponent from "../../components/search/complex/filter/my-user-switch/MyUserSwitchFilterComponent";

export interface Props {
  onFilterChanged?: (filters: StatisticsFiltersDef) => void;
  isAdmin?: boolean;
  locale?: string;
  initialFilters?: StatisticsFiltersDef;
}

export interface StatisticsFiltersDef {
  "StartDateTime"?: string;
  "EndDateTime"?: string;
  "UserID"?: string;
}

interface State {
  headerComponentRef?: HeaderComponent;
  filters?: StatisticsFiltersDef;
}

export default class StatisticsFilters extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private complexSearchComponentRef: ComplexSearchComponent;

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {}
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setHeaderComponentRef(headerComponentRef: HeaderComponent) {
    this.setState({
      headerComponentRef
    });
  }

  public onFilterChanged = (filters: StatisticsFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (closed) {
      this.setState({
        filters
      });
      onFilterChanged(filters);
    } else {
      this.setState({
        filters
      });
    }
  }

  public render = () => {
    const { locale, initialFilters, isAdmin } = this.props;
    const { headerComponentRef, filters } = this.state;
    return (
      <ComplexSearchComponent
        onFilterChanged={this.onFilterChanged}
        ref={(ref: ComplexSearchComponent) => {
          if (ref && headerComponentRef) {
            this.complexSearchComponentRef = ref;
            headerComponentRef.setSearchComplexComponentRef(ref);
          }
        }}
      >
        {isAdmin &&
          <MyUserSwitchFilterComponent
            filterID={"UserID"}
            userID={initialFilters.UserID}
            label={I18n.t("general.onlyMyTransactions")}
            initialValue={filters.UserID ? true : false}
            ref={(ref: MyUserSwitchFilterComponent) => {
              if (ref && this.complexSearchComponentRef) {
                ref.setSearchComplexComponentRef(this.complexSearchComponentRef);
              }
            }}
          />
        }
        <DateFilterComponent
          filterID={"StartDateTime"}
          label={I18n.t("general.startDate")}
          ref={(ref: DateFilterComponent) => {
            if (ref && this.complexSearchComponentRef) {
              ref.setSearchComplexComponentRef(this.complexSearchComponentRef);
            }
          }}
          locale={locale}
          minimumDate={new Date(initialFilters.StartDateTime)}
          defaultDate={filters.StartDateTime ? new Date(filters.StartDateTime) : new Date(initialFilters.StartDateTime)}
          maximumDate={filters.EndDateTime ? new Date(filters.EndDateTime) : new Date(initialFilters.EndDateTime)}
        />
        <DateFilterComponent
          filterID={"EndDateTime"}
          label={I18n.t("general.endDate")}
          ref={(ref: DateFilterComponent) => {
            if (ref && this.complexSearchComponentRef) {
              ref.setSearchComplexComponentRef(this.complexSearchComponentRef);
            }
          }}
          locale={locale}
          minimumDate={filters.StartDateTime ? new Date(filters.StartDateTime) : new Date(initialFilters.StartDateTime)}
          defaultDate={filters.EndDateTime ? new Date(filters.EndDateTime) : new Date(initialFilters.EndDateTime)}
          maximumDate={new Date(initialFilters.EndDateTime)}
        />
      </ComplexSearchComponent>
    );
  };
}
