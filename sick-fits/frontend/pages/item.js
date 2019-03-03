import SingleItem from '../components/Items/SingleItem';

const Item = props => (
  <div>
    <SingleItem id={props.query.id} />
  </div>
);

export default Item;
