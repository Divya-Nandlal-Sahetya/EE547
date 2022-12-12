//import { TableCell } from "@material-ui/core";
//import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import React, { useState, useEffect } from "react";
const tokens = require("./tokens")


export function ShowEmailList({isLoggedIn, isGmailEnabled}){

  const [token, setToken] = useState('adfsfasdf')
  const [emails, setEmails] = useState([])
  const [emaillen, setlength] = useState(0)

  const styles = (theme) => ({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      '& .ReactVirtualized__Table__headerRow': {
        flip: false,
        paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
      },
    },
    tableRow: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
  });
  
  class MuiVirtualizedTable extends React.PureComponent {
    static defaultProps = {
      headerHeight: 48,
      rowHeight: 48,
    };
  
    getRowClassName = ({ index }) => {
      const { classes, onRowClick } = this.props;
  
      return clsx(classes.tableRow, classes.flexContainer, {
        [classes.tableRowHover]: index !== -1 && onRowClick != null,
      });
    };
  
    cellRenderer = ({ cellData, columnIndex }) => {
      const { columns, classes, rowHeight, onRowClick } = this.props;
      return (
        <TableCell
          component="div"
          className={clsx(classes.tableCell, classes.flexContainer, {
            [classes.noClick]: onRowClick == null,
          })}
          variant="body"
          style={{ height: rowHeight }}
          align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
        >
          {cellData}
        </TableCell>
      );
    };
  
    headerRenderer = ({ label, columnIndex }) => {
      const { headerHeight, columns, classes } = this.props;
  
      return (
        <TableCell
          component="div"
          className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant="head"
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          <span>{label}</span>
        </TableCell>
      );
    };
  
    render() {
      const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
      return (
        <AutoSizer>
          {({ height, width }) => (
            <Table
              height={height}
              width={width}
              rowHeight={rowHeight}
              gridStyle={{
                direction: 'inherit',
              }}
              headerHeight={headerHeight}
              className={classes.table}
              {...tableProps}
              rowClassName={this.getRowClassName}
            >
              {columns.map(({ dataKey, ...other }, index) => {
                return (
                  <Column
                    key={dataKey}
                    headerRenderer={(headerProps) =>
                      this.headerRenderer({
                        ...headerProps,
                        columnIndex: index,
                      })
                    }
                    className={classes.flexContainer}
                    cellRenderer={this.cellRenderer}
                    dataKey={dataKey}
                    {...other}
                  />
                );
              })}
            </Table>
          )}
        </AutoSizer>
      );
    }
  }
  
  MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        numeric: PropTypes.bool,
        width: PropTypes.number.isRequired,
      }),
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowHeight: PropTypes.number,
  };
  
  const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
  function createData(id, from, date, message) {
    return { id, from, date, message};
  }


  useEffect(() => {
    if (isLoggedIn) {
        const fetchData = async () => {
            const token = await tokens.getToken(); // get the data from the api
            setToken(token); // set state with the result
        }
        fetchData().catch(console.error)
    }
    }, [isLoggedIn])

  useEffect(() => {

    console.log("gmail effect")
    console.log(isLoggedIn, isGmailEnabled, token)
    if(isLoggedIn === true && isGmailEnabled === true && token !== undefined && token !== ''){

      const time = new Date()
      fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+token
        },
        labelIds: ["INBOX"],
      })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log('list gmail data:', data)
        //var result = []
        //let index = 0;
        data.messages.forEach(element => {
          fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/" + element.id, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
          }).then((res) => {
            console.log(res)
            return res.json()
            }
          ).then((r) => {
            console.log("response.snippet")
              console.log(r.snippet)
              setlength(result => (result+1))
              let mailItem = {
                body : (r.snippet.length > 75) ? r.snippet.substring(0, 75) + '...' : r.snippet,
                from : "",
                date : ""
              }
              console.log("mailItem");
              console.log(mailItem);
                console.log(mailItem)
                r.payload.headers.forEach(x => {
                  if(x.name === "From"){
                    mailItem.from = x.value;
                  }
                  if(x.name === "Date"){
                    mailItem.date = x.value;
                  }
                })
               
                //result.push(r.snippet)
                setEmails(resultArr => [...resultArr, createData(emaillen, mailItem.from, mailItem.date, mailItem.body)])
          })
          //console.log(element)
        });
        
        console.log("result.length")
      })
    }
  }, [isLoggedIn, isGmailEnabled, token])

  return(
    <div>
      {(isLoggedIn && isGmailEnabled && emails !== undefined && emails !== null) ?
        emails.length === 0 ?
          "No emails to Show"
          : <Paper style={{ height: 350, width: '100%' }}>
          <VirtualizedTable
            rowCount={emails.length}
            rowGetter={({ index }) => emails[index]}
            columns={[
              {
                width: 150,
                label: 'Date',
                dataKey: 'date',
              },
              {
                width: 200,
                label: 'From',
                dataKey: 'from',
              },
              {
                width: 600,
                height: 100,
                label: 'Message',
                dataKey: 'message'
              },
            ]}
          />
        </Paper>
        : <></>}
    </div>
  )
}
