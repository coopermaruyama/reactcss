/* global describe, it, beforeEach, afterEach */
/* eslint react/prefer-stateless-function: 0 */
/* eslint react/no-multi-comp: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint no-console: 0 */

import { React, TestUtils, expect, sinon } from './helpers'
import reactCSS from '../src/reactcss'

describe('reactCSS', () => {
  const sandbox = sinon.sandbox.create()
  beforeEach(() => { sandbox.stub(console, 'warn') })
  afterEach(() => { sandbox.restore() })

  it('should return simple css', () => {
    class Component extends React.Component {
      render() {
        const styles = reactCSS({
          'default': {
            body: {
              backgroundColor: '#fafafa',
            },
          },
        })
        return <div className="body" style={ styles.body } />
      }
    }

    const component = TestUtils.renderIntoDocument(<Component />)
    const body = TestUtils.findRenderedDOMComponentWithClass(component, 'body')
    expect(body._style._values).to.eql({ 'background-color': 'rgb(250, 250, 250)' })
  })

  it('should return multiple css', () => {
    class Component extends React.Component {
      render() {
        const styles = reactCSS({
          'default': {
            title: {
              color: this.props.color,
            },
            card: {
              boxShadow: '0 0 2px rgba(0,0,0,.1)',
            },
          },
        })
        return (
          <div>
            <div className="title" style={ styles.title } />
            <div className="card" style={ styles.card } />
          </div>
        )
      }
    }

    const component = TestUtils.renderIntoDocument(<Component color="red" />)
    const title = TestUtils.findRenderedDOMComponentWithClass(component, 'title')
    expect(title._style._values).to.eql({ 'color': 'red' })
    const card = TestUtils.findRenderedDOMComponentWithClass(component, 'card')
    expect(card._style._values).to.eql({ 'box-shadow': '0 0 2px rgba(0,0,0,.1)' })
  })

  it('should return complex css', () => {
    class Component extends React.Component {
      render() {
        const styles = reactCSS({
          'default': {
            card: {
              boxShadow: '0 0 2px rgba(0,0,0,.1)',
              color: 'rgb(255, 255, 255)'
            },
          },
          'zIndex-2': {
            card: {
              boxShadow: '0 4px 8px rgba(0,0,0,.15)',
            },
          },
          'foo-true': {
            color: 'rgb(0, 0, 0)'
          }
        }, this.props)
        return (
          <div>
            <div className="card" style={ styles.card } />
          </div>
        )
      }
    }

    const component = TestUtils.renderIntoDocument(<Component zIndex="2" foo={false} />)
    const card = TestUtils.findRenderedDOMComponentWithClass(component, 'card')
    expect(card._style._values).to.eql({ 'box-shadow': '0 4px 8px rgba(0,0,0,.15)', 'color': 'rgb(255, 255, 255)' })
  });

  it('should not mutate original stylesheet', () => {
    const stylesheet = {
      'default': {
        item: {
          color: 'rgb(255, 255, 255)'
        }
      },
      'active': {
        item: {
          color: 'rgb(0, 0, 0)'
        }
      }
    };
    function Component(props) {
      const styles = reactCSS(stylesheet, props);
      return (
        <div className={props.className} style={ styles.item }></div>
      );
    }

    class Items extends React.Component {
      render() {
        return (
          <div className="root">
            <Component className="item-1" active={false} />
            <Component className="item-2" active={true} />
            <Component className="item-3" active={false} />
          </div>
        )
      }
    }

    const component = TestUtils.renderIntoDocument(<Items />);
    const item = TestUtils.findRenderedDOMComponentWithClass(component, 'item-3');
    expect(item._style._values).to.eql({ 'color': 'rgb(255, 255, 255)' });
  })

  // it('should throw a deprecation warning for using the old extend', () => {
  //   class SomeComponent extends reactCSS.Component {
  //     classes() {
  //       return {
  //         'default': {
  //           body: {
  //             background: '#fafafa',
  //           },
  //           title: {
  //             fontSize: '24px',
  //           },
  //         },
  //       }
  //     }
  //
  //     render() {
  //       return (
  //         <div style={ this.styles().body }>
  //           <div style={ this.styles().title }>Title</div>
  //         </div>
  //       )
  //     }
  //   }
  //
  //   TestUtils.renderIntoDocument(<SomeComponent />)
  //   sinon.assert.calledOnce(console.warn)
  // })
})
