import I18n from 'i18n-js';
import React from 'react';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ComplexSearchComponent from '../../../components/search/complex/ComplexSearchComponent';
import DateFilterComponent from '../../../components/search/complex/filter/date/DateFilterComponent';
import SwitchFilterComponent from '../../../components/search/complex/filter/switch/SwitchFilterComponent';

export interface Props {
  onFilterChanged?: (filters: HomeStatsFiltersDef) => void;
  visible?: boolean;
  isAdmin?: boolean;
  locale?: string;
  initialFilters?: HomeStatsFiltersDef;
}

export interface HomeStatsFiltersDef {
  'StartDateTime'?: string;
  'EndDateTime'?: string;
  'UserID'?: string;
}

interface State {
  headerComponentRef?: HeaderComponent;
  filters?: HomeStatsFiltersDef;
}

export default class HomeStatsFilters extends React.Component<Props, State> {
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

  public onFilterChanged = (filters: HomeStatsFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    this.setState({
      filters
    });
    if (closed) {
      onFilterChanged(filters);
    }
  }

  public render = () => {
    const { locale, initialFilters } = this.props;
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
        <SwitchFilterComponent
          filterID={'UserID'}
          label={'general.onlyMyTransactions'}
          value={filters.UserID ? filters.UserID === 'true': false}
          ref={(ref: SwitchFilterComponent) => {
            if (ref && this.complexSearchComponentRef) {
              ref.setSearchComplexComponentRef(this.complexSearchComponentRef);
            }
          }}
        />
        <DateFilterComponent
          filterID={'StartDateTime'}
          label={I18n.t('general.startDate')}
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
          filterID={'EndDateTime'}
          label={I18n.t('general.endDate')}
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
