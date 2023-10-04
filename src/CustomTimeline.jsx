import React, { Component } from "react";
import moment from "moment";

import Timeline from "react-calendar-timeline";
import InfoLabel from "./InfoLabel";
import generateFakeData from "./generate-fake-data";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};

export default class App extends Component {
  constructor(props) {
    super(props);

    const { groups, items } = generateFakeData();
    const defaultTimeStart = moment()
      .startOf("day")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("day")
      .add(1, "day")
      .toDate();

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      draggedItem: undefined
    };
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id
            })
          : item
      ),
      draggedItem: undefined
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time
            })
          : item
      ),
      draggedItem: undefined
    });

    console.log("Resized", itemId, time, edge);
  };

  handleItemDrag = ({ eventType, itemId, time, edge, newGroupOrder }) => {
    let item = this.state.draggedItem ? this.state.draggedItem.item : undefined;
    if (!item) {
      item = this.state.items.find(i => i.id === itemId);
    }
    this.setState({
      draggedItem: { item: item, group: this.state.groups[newGroupOrder], time }
    });
  };

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;

    return (
      <React.Fragment>
        <Timeline
          groups={groups}
          items={items}
          keys={keys}
          fullUpdate
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={0.75}
          canMove={true}
          canResize={"both"}
          defaultTimeStart={defaultTimeStart}
          defaultTimeEnd={defaultTimeEnd}
          onItemMove={this.handleItemMove}
          onItemResize={this.handleItemResize}
          onItemDrag={this.handleItemDrag}
        />
        {this.state.draggedItem && (
          <InfoLabel
            item={this.state.draggedItem.item}
            group={this.state.draggedItem.group}
            time={this.state.draggedItem.time}
          />
        )}
      </React.Fragment>
    );
  }
}
