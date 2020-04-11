import './datatable.html';
import './filters.html';
import Datatable from "../../../../lib/classes/datatable";

/**
 ALL concerning Data tables
 */
Template.table.helpers({
  datatable() {
    return new Datatable(this);
  }
});

Template.table.events({
  "click .export-csv"(event, template) { return this.exportToCsv(); }});
//  "click .save-filter": (event, template) ->
//    BkClientCore.callModal event, "_tableSaveFilterModal",
//                 data: this

Template._tableMyFilters.events({
  "change select"(event, template) {
    const datatable = template.data;
    const id = event.target.value;
    if (_.isEmpty(id)) {
      datatable.setFilter();
      datatable.setSort();
    } else {
      const myFilter = Filter.findOne(id);
      const options = EJSON.parse(myFilter.attributes.options) || {};
      datatable.setFilter(options.filters,
        {replace: 1});
      datatable.setSort(options.defaultSort);
    }
  }
});


//      datatable.setSort(options.defaultSort)
Template._tableMyFilters.helpers({
  myFilters() {
    const filters = Filters.find({subscription: this.subscription}).fetch();
    const valuesArray = [{
      label: I18n.t("Filter.choose"),
      value: "",
      selected: true
    }
    ];
    for (let k in filters) {
      const f = filters[k];
      valuesArray.push({
        label: f.name,
        value: f._id
      });
    }

    const myFilters = {};
    myFilters.values = valuesArray;
    return myFilters;
  }
});

Template._tablePerPage.helpers({
  perPages() { return [5,10,20,50]; }});

Template._tablePerPage.events({
  'change select'(event, template) { return this.setPerPage(event.target.value); }});


Template._tableHeaders.events({
  "click th"(event, template) {
    const datatable = template.data;
    let sort = undefined;
    if (this.sort === 1) {
      sort = -1;
    } else {
      sort = 1;
    }
    const result = {};
    result[this.field] = sort;
    datatable.setSort(result);
  }
});

Template._tableHeaders.helpers({
  sorted() { if (!_.isUndefined(this.getSort())) { return "sorted"; } }});

Template._tableSaveFilterModal.helpers({
  newFilter() {
    return new Filter({
      subscription: this.subscription,
      options: EJSON.stringify({
        defaultFilter: this.defaultFilter,
        defaultSort: this.defaultSort,
        filters: this.filters,
        model: this.model,
        perPage: this.perPage,
        subscription: this.subscription,
        fields: this.fields.map(f => f.field).toString(),
        color: this.getColor(),
        width: this.getWidth(),
        actions: this.actions,
        customActions: this.customActions,
        subscribeFields: this.subscribeFields
      })
    });
  }
});

Template._tableFilters.events({
  "change input"(event, template) {
    const datatable = template.data;
    const filter = {};
    if (_.isEmpty(event.target.value)) {
      filter[event.target.name] = "";
    } else {
      filter[event.target.name] = {
        $regex: event.target.value,
        $options: "i"
      };
    }
    datatable.setFilter(filter);
    datatable.setPage(1);
  },

  "change select"(event, template) {
    const datatable = template.data;
    const filter = {};
    filter[event.target.name] = event.target.value;
    datatable.setFilter(filter);
    datatable.setPage(1);
  }
});

Template._tableRows.helpers({
  getModel() {
    const datatable = Template.instance().data;
    if (datatable.type === "array") {
      return this;
    } else {
      return datatable.klass.new(this);
    }
  }
});

Template._tableRow.onRendered(function() {
//   currentView = Template.instance().view
//   tableRows = Blaze.getView(currentView,"each")
//   if tableRows.isRendered
//     # new element appears in the table
//     this.$("tr").fadeIn(2000)
//   else
  // First show of the complete table
  return this.$("tr").fadeIn();
});

Template._actionButtons.helpers({
  modalFields() {
    const tableData = Template.parentData(3);
    if (tableData && tableData.modalFields) { return tableData.modalFields; }
    if (tableData && tableData.exclude) { return undefined; }
    if (!tableData || !tableData.fields || (tableData.fields === "*")) { return undefined; }
    return tableData && tableData.fields;
  }
});

Template.deleteButton.helpers({
  deleteClass() {
    if (this.class) { return this.class; }
    if (this.actionType === "btn") {
      return "btn btn-xs btn-danger";
    } else {
      return "red ace-icon fa fa-trash-o bigger-120";
    }
  },

  deleteLabel() {
    if (this.actionType === "btn") {
      if (this.label) {
        return this.title;
      } else {
        return "X";
      }
    } else {
      return this.label;
    }
  },

  deleteTitle() { return this.title || "submit.delete"; }
});


Template._tablePagination.helpers({
  pages() {
    let i;
    const pages = [];
    const maxPage = this.getMaxPage() || 1;
    if (maxPage <= 7) {
      i = 1;

      while (i <= maxPage) {
        pages.push(i);
        i++;
      }
    } else {
      this.pagedep.depend();
      pages.push(1);
      pages.push(2);
      if (this.page > 4) { pages.push("..."); }
      i = Math.max(this.page - 1, 3);

      while (i <= Math.max(3, Math.min(this.page + 1, maxPage - 2))) {
        pages.push(i);
        i++;
      }
      if ((this.page + 3) < maxPage) { pages.push("..."); }
      pages.push(maxPage - 1);
      pages.push(maxPage);
    }
    return pages;
  }
});

Template._tablePagination.events({
  "click .page"(event, template) {
    const datatable = template.data;
    datatable.setPage(this);
  },

  "click .first"() {
    this.setPage(1);
  },

  "click .prev"() {
    this.setPage(this.page - 1);
  },

  "click .next"() {
    this.setPage(this.page + 1);
  },

  "click .last"() {
    this.setPage(this.getMaxPage());
  }
});