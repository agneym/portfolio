import { Input } from ".";

const meta = {
  title: "UIKit/Input",
  component: Input,
};

export default meta;

export const Primary = () => {
  return (
    <Input.Group>
      <Input.Label>Email</Input.Label>
      <Input.Input type="email" />
    </Input.Group>
  );
};

export const WithDescription = () => {
  return (
    <Input.Group hasDescription>
      <Input.Label>Email</Input.Label>
      <Input.Input type="email" placeholder="john@doe.com" />
      <Input.Description>Enter your email address</Input.Description>
    </Input.Group>
  );
};
