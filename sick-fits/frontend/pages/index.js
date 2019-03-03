import Items from '../components/Items/Items.js';

const Home = props => (
  <div>
    <Items page={parseFloat(props.query.page) || 1} />
  </div>
);

export default Home;
