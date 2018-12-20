/**
 * 代码分割模型
 * @author barret
 * @date 2018/12/20
 */
import React from 'react'
import PropTypes from 'prop-types';

/*
 *  代码分割模型，调用该模型的方式如下。
 *  import SearchContainer from 'bundle-loader?lazy!./containers/Search/searchContainer';
 *
 *  const Search = () => (
 *      <Bundle load={SearchContainer}>
 *          {(Search) => <Search />}
 *      </Bundle>
 *  )
 */

export default class Bundle extends React.Component {

    state = {
        // short for "module" but that's a keyword in js, so "mod"
        mod: null
    }

    componentWillMount() {
        this.load(this.props)
    }

    componentWillReceiveProps(nextProps) {
        const { load } = this.props;
        if (nextProps.load !== load) {
            this.load(nextProps)
        }
    }

    load(props) {
        this.setState({
            mod: null
        })
        props.load((mod) => {
            this.setState({
                // handle both es imports and cjs
                mod: mod.default ? mod.default : mod
            })
        })
    }

    render() {
        const { mod} = this.state;
        const { children } = this.props;

        if (!mod) return false;
        return children(mod)
    }
}

Bundle.propTypes = {
    load: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}